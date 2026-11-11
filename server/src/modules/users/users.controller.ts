import type { NextFunction, Response, Request } from "express";
import {
    addMovieToWatchlist,
    getUserProfile,
    getUserWatchlist,
    removeMovieFromWatchlist,
    updateUserProfile,
} from "./users.service"
import type { updateProfileSchema } from "./users.validation";
import type { z } from "zod";


// GET USER
export const getMe = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await getUserProfile(req.user!.id);

        if(!user) {
            res.status(404).json({
                message: "User not found"
            });

            return;
        }

        res.status(200).json({
            message: "Profile retrieved successfully",
            data: user
        })

    } catch (error) {
        next(error)
    }
}

export const updateMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await updateUserProfile(
            req.user!.id,
            res.locals.validatedBody as z.infer<typeof updateProfileSchema>,
        );

        if (!user) {
            res.status(409).json({ error: "Email is already in use" });
            return;
        }

        res.status(200).json({
            message: "Profile updated successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export const getWatchlist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const watchlist = await getUserWatchlist(req.user!.id);
        res.status(200).json({
            message: "Watchlist retrieved successfully",
            data: watchlist,
        });
    } catch (error) {
        next(error);
    }
};

export const addWatchlistMovie = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { tmdbMovieId } = res.locals.validatedBody as { tmdbMovieId: number };
        const item = await addMovieToWatchlist(req.user!.id, tmdbMovieId);
        res.status(201).json({
            message: "Movie added to watchlist",
            data: item,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteWatchlistMovie = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { tmdbMovieId } = req.params as { tmdbMovieId: string };
        const result = await removeMovieFromWatchlist(req.user!.id, Number(tmdbMovieId));

        if (result.count === 0) {
            res.status(404).json({ error: "Movie is not in your watchlist" });
            return;
        }

        res.status(200).json({ message: "Movie removed from watchlist" });
    } catch (error) {
        next(error);
    }
};