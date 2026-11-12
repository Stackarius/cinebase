import type { Request, Response, NextFunction } from "express"
import {
    loginUser,
    refreshAuthTokens,
    registerUser,
    revokeRefreshToken,
} from "./auth.service"
import { env } from "../../config";

const ACCESS_TOKEN_COOKIE = "accessToken";
const REFRESH_TOKEN_COOKIE = "refreshToken";
const isProduction = env.NODE_ENV === "production";
const authCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" as const : "lax" as const,
};

const setAuthCookies = (
    res: Response,
    tokens: { accessToken: string; refreshToken: string },
): void => {
    res.cookie(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
        ...authCookieOptions,
        path: "/api",
        maxAge: 15 * 60 * 1000,
    });

    res.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
        ...authCookieOptions,
        path: "/api/auth",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

const clearAuthCookies = (res: Response): void => {
    res.clearCookie(ACCESS_TOKEN_COOKIE, { ...authCookieOptions, path: "/api" });
    res.clearCookie(REFRESH_TOKEN_COOKIE, { ...authCookieOptions, path: "/api/auth" });
};

// register user
export const registerUserHandler = async (req: Request, res: Response, next:NextFunction): Promise<void> => {
    try {
        const {name, email, password} = req.body

        const result = await registerUser(name,email, password)

        if (!result) {
            res.status(409).json({
                error: "Email is already registered"
            })

            return;
        }

        setAuthCookies(res, result);

        res.status(201).json({
            message: "Account created successfully",
            data: result.user
        })
    } catch(error){
        next(error)
    }
}

export const loginUserHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {email, password} = req.body;

        const result = await loginUser(email, password);

        if(!result) {
            res.status(401).json({
                error: "Invalid credentials"
            })

            return ;
        }

        setAuthCookies(res, result);

        res.status(200).json({
            message: "Login successful",
            data: result.user
        })

    } catch(error){
        next(error)
    }
}

export const refreshTokenHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const token = req.cookies?.[REFRESH_TOKEN_COOKIE];
        const result = token ? await refreshAuthTokens(token) : null;

        if (!result) {
            clearAuthCookies(res);
            res.status(401).json({ error: "Invalid or expired refresh token" });
            return;
        }

        setAuthCookies(res, result);
        res.status(200).json({ message: "Token refreshed" });
    } catch (error) {
        next(error);
    }
};

export const logoutUserHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        await revokeRefreshToken(req.cookies?.[REFRESH_TOKEN_COOKIE]);
        clearAuthCookies(res);
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        next(error);
    }
};
