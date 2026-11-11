import { useEffect, useState } from "react";
import MovieGrid from "../../components/ui/MovieGrid";
import PageContainer from "../../components/layout/PageContainer";
import { getMovieDetails } from "../movies/movies.api";
import { clearRecentMovieIds, getRecentMovieIds } from "../movies/recent.storage";
import type { Movie } from "../movies/movie.types";

const RecentPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  const [hasRecentMovies, setHasRecentMovies] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadRecentMovies = async () => {
      setLoading(true);
      setError(null);
      let movieIds: number[];
      try {
        movieIds = getRecentMovieIds();
        setHasRecentMovies(movieIds.length > 0);
      } catch (storageError) {
        console.error("Could not read recently viewed movies:", storageError);
        if (!cancelled) {
          setMovies([]);
          setHasRecentMovies(false);
          setError("Browser history could not be read. Check your browser storage settings.");
          setLoading(false);
        }
        return;
      }

      try {
        const results = await Promise.allSettled(movieIds.map(getMovieDetails));
        if (cancelled) return;

        const loadedMovies = results.flatMap((result) =>
          result.status === "fulfilled" ? [result.value] : [],
        );
        const failedCount = results.length - loadedMovies.length;
        setMovies(loadedMovies);
        if (failedCount > 0) {
          setError(`${failedCount} recently viewed ${failedCount === 1 ? "movie could" : "movies could"} not be loaded.`);
        }
      } catch (requestError) {
        console.error("Failed to load recently viewed movies:", requestError);
        if (!cancelled) setError("Recently viewed movies could not be loaded.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadRecentMovies();
    return () => {
      cancelled = true;
    };
  }, [retry]);

  const clearHistory = () => {
    try {
      clearRecentMovieIds();
      setMovies([]);
      setHasRecentMovies(false);
      setError(null);
    } catch (storageError) {
      console.error("Could not clear recently viewed movies:", storageError);
      setError("Browser history could not be cleared. Check your browser storage settings.");
    }
  };

  return (
    <PageContainer
      title="Recently viewed"
      description="Pick up where you left off. This history is saved in this browser."
    >
      {hasRecentMovies && (
        <button
          type="button"
          onClick={clearHistory}
          className="mb-5 rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
        >
          Clear history
        </button>
      )}
      {error && movies.length > 0 && (
        <p role="status" className="mb-4 rounded-lg border border-amber-300/20 bg-amber-300/5 p-3 text-sm text-amber-100">{error}</p>
      )}
      <MovieGrid
        movies={movies}
        loading={loading}
        error={error && movies.length === 0 && hasRecentMovies ? error : null}
        emptyMessage="Movies you open will appear here."
        onRetry={() => setRetry((count) => count + 1)}
      />
    </PageContainer>
  );
};

export default RecentPage;
