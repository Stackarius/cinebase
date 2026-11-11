const RECENT_MOVIES_KEY = "cinebase:recent-movies";
const MAX_RECENT_MOVIES = 20;

export const getRecentMovieIds = (): number[] => {
  const storedValue = localStorage.getItem(RECENT_MOVIES_KEY);
  if (!storedValue) return [];

  try {
    const parsed: unknown = JSON.parse(storedValue);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (id): id is number => Number.isInteger(id) && id > 0,
    ).slice(0, MAX_RECENT_MOVIES);
  } catch {
    return [];
  }
};

export const recordRecentMovie = (movieId: number): void => {
  const recentMovieIds = getRecentMovieIds().filter((id) => id !== movieId);
  localStorage.setItem(
    RECENT_MOVIES_KEY,
    JSON.stringify([movieId, ...recentMovieIds].slice(0, MAX_RECENT_MOVIES)),
  );
};

export const clearRecentMovieIds = (): void => {
  localStorage.removeItem(RECENT_MOVIES_KEY);
};
