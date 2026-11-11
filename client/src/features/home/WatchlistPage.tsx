import { useEffect, useState } from "react";
import MovieGrid from "../../components/ui/MovieGrid";
import PageContainer from "../../components/layout/PageContainer";
import { getMovieDetails } from "../movies/movies.api";
import type { Movie } from "../movies/movie.types";
import { getWatchlist, removeFromWatchlist } from "../watchlist/watchlist.api";

const WatchlistPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  const [removingMovieId, setRemovingMovieId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setLoading(true);
      setError(null);
      setActionError(null);
      try {
        const items = await getWatchlist();
        const results = await Promise.allSettled(items.map((item) => getMovieDetails(item.tmdbMovieId)));
        if (cancelled) return;

        const loadedMovies = results.flatMap((result) =>
          result.status === "fulfilled" ? [result.value] : [],
        );
        setMovies(loadedMovies);
        const failedCount = results.length - loadedMovies.length;
        if (failedCount > 0) {
          setActionError(`${failedCount} saved ${failedCount === 1 ? "movie could" : "movies could"} not be loaded from TMDB.`);
        }
      } catch (requestError) {
        console.error("Failed to load watchlist:", requestError);
        if (!cancelled) setError("Your watchlist could not be loaded. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [retry]);

  const handleRemove = async (movieId: number) => {
    setRemovingMovieId(movieId);
    setActionError(null);
    try {
      await removeFromWatchlist(movieId);
      setMovies((currentMovies) => currentMovies.filter((movie) => movie.id !== movieId));
    } catch (requestError) {
      console.error("Failed to remove movie from watchlist:", requestError);
      setActionError("Could not remove this movie. Please try again.");
    } finally {
      setRemovingMovieId(null);
    }
  };

  return (
    <PageContainer
      title="Your watchlist"
      description="Your saved movies are linked to your Cinebase account and available across sessions."
    >
      {actionError && (
        <p role="alert" className="mb-4 rounded-lg border border-amber-300/20 bg-amber-300/5 p-3 text-sm text-amber-100">{actionError}</p>
      )}
      <MovieGrid
        movies={movies}
        loading={loading}
        error={error}
        emptyMessage="Your watchlist is empty. Add a movie from its details page."
        onRetry={() => setRetry((count) => count + 1)}
        onRemove={handleRemove}
        removingMovieId={removingMovieId}
      />
    </PageContainer>
  );
};

export default WatchlistPage;
