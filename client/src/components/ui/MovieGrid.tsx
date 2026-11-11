import { ArrowUpRight, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { Movie } from "../../features/movies/movie.types";

type MovieGridProps = {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  emptyMessage: string;
  onRetry?: () => void;
  onRemove?: (movieId: number) => void;
  removingMovieId?: number | null;
};

const MovieGrid = ({
  movies,
  loading,
  error,
  emptyMessage,
  onRetry,
  onRemove,
  removingMovieId,
}: MovieGridProps) => {
  if (loading) {
    return <p role="status" className="py-16 text-center text-white/70">Loading movies...</p>;
  }

  if (error) {
    return (
      <div role="alert" className="rounded-2xl border border-red-300/20 bg-red-300/5 p-6 text-center">
        <p className="text-red-200">{error}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 rounded-lg bg-white/10 px-4 py-2 font-semibold text-white hover:bg-white/15"
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  if (movies.length === 0) {
    return <p className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/65">{emptyMessage}</p>;
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {movies.map((movie) => (
        <li key={movie.id} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gray-900">
          <Link to={`/movies/${movie.id}`} className="block">
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={`${movie.title} poster`}
                className="aspect-[2/3] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                loading="lazy"
              />
            ) : (
              <div className="grid aspect-[2/3] place-items-center bg-gradient-to-br from-cyan-950 to-gray-900 p-6 text-center text-lg font-bold text-white">
                {movie.title}
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black via-black/80 to-transparent p-4 pt-12">
              <span className="min-w-0">
                <span className="block truncate font-bold text-white">{movie.title}</span>
                <span className="mt-1 block text-sm text-white/65">
                  Rating {movie.vote_average.toFixed(1)} / 10
                </span>
              </span>
              <ArrowUpRight size={18} className="shrink-0 text-cyan-200" aria-hidden="true" />
            </div>
          </Link>
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(movie.id)}
              disabled={removingMovieId === movie.id}
              aria-label={`Remove ${movie.title} from watchlist`}
              className="absolute right-3 top-3 rounded-full bg-gray-950/80 p-2 text-white transition hover:bg-red-500 disabled:cursor-wait disabled:opacity-60"
            >
              <Trash2 size={17} aria-hidden="true" />
            </button>
          )}
        </li>
      ))}
    </ul>
  );
};

export default MovieGrid;
