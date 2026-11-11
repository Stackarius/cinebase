import {prisma} from "../../config/database";
import type { z } from "zod";
import type { updateProfileSchema } from "./users.validation";

// get user profile

export const getUserProfile = async (userId: string) => {
    // fetch user from db
    const user = await prisma.user.findUnique({
        where: { id: userId  },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true
        }
    })

    return user
}

export const getUserWatchlist = async (userId: string) =>
    prisma.watchlist.findMany({
        where: { userId },
        orderBy: { addedAt: "desc" },
        select: {
            tmdbMovieId: true,
            addedAt: true,
        },
    });

export const addMovieToWatchlist = async (userId: string, tmdbMovieId: number) =>
    prisma.watchlist.upsert({
        where: {
            userId_tmdbMovieId: { userId, tmdbMovieId },
        },
        create: { userId, tmdbMovieId },
        update: {},
        select: {
            tmdbMovieId: true,
            addedAt: true,
        },
    });

export const removeMovieFromWatchlist = async (userId: string, tmdbMovieId: number) =>
    prisma.watchlist.deleteMany({
        where: { userId, tmdbMovieId },
    });

export const updateUserProfile = async (
    userId: string,
    data: z.infer<typeof updateProfileSchema>,
) => {
    if (data.email) {
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
            select: { id: true },
        });

        if (existingUser && existingUser.id !== userId) {
            return null;
        }
    }

    return prisma.user.update({
        where: { id: userId },
        data,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};