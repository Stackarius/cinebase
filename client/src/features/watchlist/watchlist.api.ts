import { api } from "../../lib/axios";

export type WatchlistItem = {
  tmdbMovieId: number;
  addedAt: string;
};

type ApiResponse<T> = {
  data: T;
};

export const getWatchlist = async (): Promise<WatchlistItem[]> => {
  const response = await api.get<ApiResponse<WatchlistItem[]>>("/users/watchlist");
  return response.data.data;
};

export const addToWatchlist = async (tmdbMovieId: number): Promise<void> => {
  await api.post("/users/watchlist", { tmdbMovieId });
};

export const removeFromWatchlist = async (tmdbMovieId: number): Promise<void> => {
  await api.delete(`/users/watchlist/${tmdbMovieId}`);
};
