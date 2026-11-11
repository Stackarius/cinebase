import {Router} from 'express'
import { getMovieDetailsHandler, getPopular, searchMoviesHandler } from './movie.controller';
import {movieIdSchema, paginationSchema, searchMoviesSchema} from './movie.validation'
import { validate } from '../../middlewares/validare.middleware';
import { requireAuth } from '../../middlewares/auth.middleware';

const router: Router = Router()

router.use(requireAuth)
router.get("/", validate(paginationSchema, "query"), getPopular)
router.get("/search", validate(searchMoviesSchema, "query"), searchMoviesHandler)
router.get("/:id", validate(movieIdSchema, "params"), getMovieDetailsHandler)

export default router