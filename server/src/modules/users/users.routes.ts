import { Router } from "express";
import {
    addWatchlistMovie,
    deleteWatchlistMovie,
    getMe,
    getWatchlist,
    updateMe,
} from "./users.controller";
import { requireAuth } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validare.middleware";
import { updateProfileSchema } from "./users.validation";
import { z } from "zod";

const router: Router = Router()

router.get("/profile", requireAuth, getMe);
router.patch("/profile", requireAuth, validate(updateProfileSchema), updateMe);
router.get("/watchlist", requireAuth, getWatchlist);
router.post(
    "/watchlist",
    requireAuth,
    validate(z.object({ tmdbMovieId: z.coerce.number().int().positive() })),
    addWatchlistMovie,
);
router.delete(
    "/watchlist/:tmdbMovieId",
    requireAuth,
    validate(z.object({ tmdbMovieId: z.coerce.number().int().positive() }), "params"),
    deleteWatchlistMovie,
);

export default router;