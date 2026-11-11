import { createHash, randomBytes } from "node:crypto";
import { argon2id, argon2Verify } from "hash-wasm";
import jwt from "jsonwebtoken"

import { prisma } from "../../config/database"
import { env } from "../../config";

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const hashRefreshToken = (token: string): string =>
    createHash("sha256").update(token).digest("hex");

const createRefreshToken = async (userId: string) => {
    const refreshToken = randomBytes(64).toString("base64url");
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

    await prisma.refreshToken.create({
        data: {
            userId,
            tokenHash: hashRefreshToken(refreshToken),
            expiresAt,
        },
    });

    return refreshToken;
};

const createAccessToken = (userId: string) =>
    jwt.sign(
        { sub: userId },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] }
    );

// register user

export const registerUser = async (name: string, email: string, password: string) => {
    // check for existing user
    const existingUser = await prisma.user.findUnique({ where: { email } })

    if (existingUser) {
        return null
    }

    const hash = await argon2id({
        password,
        salt: randomBytes(16),
        parallelism: 1,
        iterations: 3,
        memorySize: 65536,
        hashLength: 32,
        outputType: "encoded",
    });
    if (typeof hash !== "string") {
        throw new Error("Argon2id returned an invalid encoded hash");
    }
    const hashedPassword = hash;

    const user = await prisma.user.create({
        data: {
            name, email, ashiri: hashedPassword
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true
        },
    });

    const accessToken = createAccessToken(user.id);
    const refreshToken = await createRefreshToken(user.id);

    return { user, accessToken, refreshToken }
}

// login
export const loginUser = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            ashiri: true,
        },
    })

    if (!user) {
        return null
    }

    const isPasswordValid = await argon2Verify({
        password,
        hash: user.ashiri,
    })

    if (!isPasswordValid) {
        return null
    }

    const safeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
    }
    const accessToken = createAccessToken(user.id);
    const refreshToken = await createRefreshToken(user.id);

    return { user: safeUser, accessToken, refreshToken }
}

export const refreshAuthTokens = async (token: string) => {
    const tokenHash = hashRefreshToken(token);
    const storedToken = await prisma.refreshToken.findUnique({
        where: { tokenHash },
        select: {
            id: true,
            userId: true,
            expiresAt: true,
            revokedAt: true,
        },
    });

    if (
        !storedToken ||
        storedToken.revokedAt ||
        storedToken.expiresAt <= new Date()
    ) {
        return null;
    }

    const refreshToken = randomBytes(64).toString("base64url");
    const nextTokenHash = hashRefreshToken(refreshToken);
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
    const accessToken = createAccessToken(storedToken.userId);

    const rotated = await prisma.$transaction(async (transaction) => {
        const revoked = await transaction.refreshToken.updateMany({
            where: {
                id: storedToken.id,
                revokedAt: null,
                expiresAt: { gt: new Date() },
            },
            data: { revokedAt: new Date() },
        });

        if (revoked.count !== 1) {
            return false;
        }

        await transaction.refreshToken.create({
            data: {
                userId: storedToken.userId,
                tokenHash: nextTokenHash,
                expiresAt,
            },
        });

        return true;
    });

    if (!rotated) {
        return null;
    }

    return { accessToken, refreshToken };
};

export const revokeRefreshToken = async (token: string | undefined) => {
    if (!token) {
        return;
    }

    await prisma.refreshToken.updateMany({
        where: {
            tokenHash: hashRefreshToken(token),
            revokedAt: null,
        },
        data: { revokedAt: new Date() },
    });
};

// forget password

// reset password