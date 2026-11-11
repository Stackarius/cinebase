import { tmdbAPI } from "../../config/tmdb";

export const getPopularMovies = async(page: number) => {
    const response = await tmdbAPI.get("/movie/popular", {
        params: {page}
    })

    return response.data
}
export const searchMovies = async (query: string, page:number) => {
    const response = await tmdbAPI.get("/search/movie", {
        params: {query, page}
    })
    return response.data
}

export const getMovieDetails = async (id: number) => {
    const response = await tmdbAPI.get(`/movie/${id}`, {
        params: { append_to_response: "credits,videos" },
    });

    return response.data;
}
