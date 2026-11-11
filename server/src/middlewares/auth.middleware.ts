import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config";

export const requireAuth: RequestHandler = (req, res, next) => {
    const authorization = req.header("Authorization");
    const token = req.cookies?.accessToken;

    if (!token) {
        res.status(401).json({ error: "Authentication required" });
        return;
    }

    try {
        const payload = jwt.verify(token, env.JWT_SECRET);
        if (typeof payload === "string" || typeof payload.sub !== "string") {
            res.status(401).json({ error: "Invalid or expired token" });
            return;
        }
 
        req.user = { id: payload.sub };

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ error: "Invalid or expired token" });
            return;
        }

        next(error);
    }
};
