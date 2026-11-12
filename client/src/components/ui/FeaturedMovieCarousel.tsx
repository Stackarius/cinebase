import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Movie } from "../../features/movies/movie.types";
import WatchlistToggleButton from "../../features/watchlist/WatchlistToggleButton";

type FeaturedMovieCarouselProps = {
  movies: Movie[];
  loading: boolean;
};

const FeaturedMovieCarousel = ({ movies, loading }: FeaturedMovieCarouselProps) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselMovies = movies.slice(0, 3);
  const activeMovie = carouselMovies[activeSlide];
  
useEffect(() => {
  if (loading || carouselMovies.length < 2) return;

  const timeoutId = window.setTimeout(() => {
    setActiveSlide((index) => (index + 1) % carouselMovies.length);
  }, 5000);

  return () => window.clearTimeout(timeoutId);
}, [activeSlide, carouselMovies.length, loading]);

  return (
    <div
      className="relative flex min-h-60 w-full flex-col justify-between rounded-2xl bg-cyan-900 bg-cover bg-center px-4 py-4 transition-all duration-500 sm:min-h-65 sm:px-8"
      style={{
        backgroundImage: activeMovie?.backdrop_path
          ? `url(https://image.tmdb.org/t/p/w1280${activeMovie.backdrop_path})`
          : undefined,
      }}
    >
      <div className="absolute inset-0 rounded-2xl bg-black/50" />
      <h3 className="relative z-10 mt-3 line-clamp-2 text-2xl font-black text-white sm:text-3xl">
        {activeMovie?.title ?? (loading ? "Loading movies..." : "No movies to show")}
      </h3>
      {activeMovie && (
        <p className="relative z-10 text-white">
          Rating: {activeMovie.vote_average.toFixed(1)}
        </p>
      )}

      <div className="relative z-10 mt-10 flex items-center justify-between text-white">
        <button
          type="button"
          aria-label="Previous movie"
          disabled={carouselMovies.length < 2}
          onClick={() =>
            setActiveSlide((index) => (index - 1 + carouselMovies.length) % carouselMovies.length)
          }
          className="rounded-lg bg-white/40 p-1 disabled:opacity-40"
        >
          <ArrowLeft />
        </button>
        <button
          type="button"
          aria-label="Next movie"
          disabled={carouselMovies.length < 2}
          onClick={() => setActiveSlide((index) => (index + 1) % carouselMovies.length)}
          className="rounded-lg bg-white/40 p-1 disabled:opacity-40"
        >
          <ArrowRight />
        </button>
      </div>

      <div className="relative z-10 mt-10 flex items-center justify-between text-white">
        {activeMovie && <WatchlistToggleButton key={activeMovie.id} movieId={activeMovie.id} />}

        <div className="flex gap-0.5">
          {carouselMovies.map((movie, index) => (
            <button
              key={movie.id}
              type="button"
              aria-label={`Show ${movie.title}`}
              aria-current={index === activeSlide}
              onClick={() => setActiveSlide(index)}
              className={`rounded-lg p-1 ${index === activeSlide ? "bg-cyan-400" : "bg-white/40"}`}
            />
          ))}
        </div>

        {activeMovie && (
          <Link to={`/movies/${activeMovie.id}`} className="flex gap-2 rounded-md bg-gray-900 px-3 py-2 font-semibold">
            Watch Now
          </Link>
        )}
      </div>
    </div>
  );
};

export default FeaturedMovieCarousel;
