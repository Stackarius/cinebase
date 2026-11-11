import { useRef } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, LoaderIcon } from "lucide-react";
import { Link } from "react-router-dom";
import type { Movie } from "../../features/movies/movie.types";

type PopularMoviesSectionProps = {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
};

const PopularMoviesSection = ({
  movies,
  loading,
  error,
  onRetry,
}: PopularMoviesSectionProps) => {
  const moviesRef = useRef<HTMLDivElement>(null);

  const scrollMovies = (direction: -1 | 1) => {
    const container = moviesRef.current;
    const firstCard = container?.firstElementChild;
    if (!container || !(firstCard instanceof HTMLElement)) return;

    const gap = Number.parseFloat(getComputedStyle(container).columnGap) || 0;
    const distance = (firstCard.getBoundingClientRect().width + gap) * 3;
    container.scrollBy({ left: direction * distance, behavior: "smooth" });
  };

  return (
    <section aria-labelledby="popular-movies-heading">
      <div className="mb-5 mt-8 flex items-center justify-between">
        <h3 id="popular-movies-heading" className="text-2xl font-semibold text-white">
          Popular on CineBase
        </h3>
        {!loading && !error && movies.length > 3 && (
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Scroll popular movies left"
              onClick={() => scrollMovies(-1)}
              className="rounded-full bg-white/15 p-2 text-white hover:bg-white/25"
            >
              <ArrowLeft />
            </button>
            <button
              type="button"
              aria-label="Scroll popular movies right"
              onClick={() => scrollMovies(1)}
              className="rounded-full bg-white/15 p-2 text-white hover:bg-white/25"
            >
              <ArrowRight />
            </button>
          </div>
        )}
      </div>

      <div className="min-h-50">
        {loading ? (
          <p className="py-16 text-center text-white">Loading movies...</p>
        ) : error ? (
          <div role="alert" className="mx-auto w-fit rounded-md border-2 p-10 text-center text-red-400">
            <LoaderIcon className="mx-auto block" />
            <p className="text-xl">{error}</p>
            <button
              type="button"
              onClick={onRetry}
              className="mx-auto mt-2 block rounded bg-cyan-600 px-3 py-2 text-white hover:bg-cyan-700"
            >
              Try again
            </button>
          </div>
        ) : (
          <div
            ref={moviesRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {movies.map((movie) => (
              <Link
                key={movie.id}
                to={`/movies/${movie.id}`}
                aria-label={`View details for ${movie.title}`}
                className="group relative h-52 w-60 shrink-0 snap-start overflow-hidden rounded-md bg-gray-600 bg-cover bg-center"
                style={{
                  backgroundImage: movie.backdrop_path
                    ? `url(https://image.tmdb.org/t/p/w780${movie.backdrop_path})`
                    : undefined,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 text-white">
                  <div className="min-w-0">
                    <h4 className="truncate font-semibold transition-colors group-hover:text-cyan-300">{movie.title}</h4>
                    <p className="text-sm">Rating: {movie.vote_average.toFixed(1)}</p>
                  </div>
                  <ArrowUpRight size={20} aria-hidden="true" />
                </div>
              </Link>
            ))}
            {movies.length === 0 && <p className="py-16 text-white">No popular movies found.</p>}
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularMoviesSection;
