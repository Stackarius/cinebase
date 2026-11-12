import { useEffect, useState } from "react";
import { getPopularMovies } from "../../features/movies/movies.api";
import type { Movie } from "../../features/movies/movie.types";
import { Header } from "./Header";
import FeaturedMovieCarousel from "../ui/FeaturedMovieCarousel";
import PopularMoviesSection from "../ui/PopularMoviesSection";

const Display = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchMovies = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getPopularMovies();
        if (!cancelled) setMovies(response.results);
      } catch (requestError) {
        console.error("Failed to fetch popular movies:", requestError);
        if (!cancelled) setError("Could not load movies. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void fetchMovies();

    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  return (
    <section className="custom-scrollbar relative h-dvh min-h-0 min-w-0 flex-1 overflow-y-auto bg-gray-800 px-4 pb-20 sm:px-6 md:pb-6 lg:px-10">
      <Header />
      <main className="pt-5 sm:pt-8 lg:pt-12">
        <FeaturedMovieCarousel movies={movies} loading={loading} />
        <PopularMoviesSection
          movies={movies}
          loading={loading}
          error={error}
          onRetry={() => setRetryCount((count) => count + 1)}
        />
      </main>
    </section>
  );
};

export default Display;
