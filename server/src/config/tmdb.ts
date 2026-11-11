import axios from 'axios'
import { env } from "../config";

export const tmdbAPI = axios.create({
    baseURL: "https://api.themoviedb.org/3",
    headers: {
    Authorization: `Bearer ${env.TMDB_ACCESS_TOKEN}`,
    Accept: "application/json",
  },
  timeout: 10000,
})
