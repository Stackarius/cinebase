import {api} from '../../lib/axios'
import type { MovieDetails, MovieList } from "./movie.types";

type ApiResponse<T> = {
    data: T;
};

export const getPopularMovies = async (page = 1): Promise<MovieList> => {
    const response = await api.get<ApiResponse<MovieList>>("/movies/", {
        params: {page}
    })

    return response.data.data
}

export const searchMovies = async(
    query: string,
    page = 1,
): Promise<MovieList> => {
    const response = await api.get<ApiResponse<MovieList>>("/movies/search", {
        params : {query, page}
    })

    return response.data.data
}

export const getMovieDetails = async (id: number): Promise<MovieDetails> => {
    const response = await api.get<ApiResponse<MovieDetails>>(`/movies/${id}`);

    return response.data.data;
}