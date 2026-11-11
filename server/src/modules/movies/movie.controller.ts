import type {Request, Response, NextFunction} from 'express'
import {getMovieDetails, getPopularMovies, searchMovies} from './movie.service'

export const getPopular = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = Number(req.query.page ?? 1)

        const result = await getPopularMovies(page)

        if(!result) {
            res.status(404).json({
                message: "No popular movies found"
            })
        }

        res.status(201).json({
            message: "Movies found",
            data: result
        })
    } catch(error){
        next(error)
    }
}

export const searchMoviesHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {query, page} = req.query as {query: string, page: string}
        const pgNumber = Number(page ?? 1)

        const result = await searchMovies(query, pgNumber );

        if(!result) {
            res.status(404).json({
                message: "No movies found"
            })
        }

        res.status(201).json({
            message: "Movies found",
            data: result
        })
    } catch(error) {
        next(error)
    }
}

export const getMovieDetailsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const result = await getMovieDetails(id);

        res.status(200).json({
            message: "Movie found",
            data: result,
        });
    } catch (error) {
        next(error);
    }
}