import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, Clock3, Play, Star } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getMovieDetails } from "./movies.api";
import type { MovieDetails } from "./movie.types";
import { Header } from "../../components/layout/Header";
import { recordRecentMovie } from "./recent.storage";
import WatchlistToggleButton from "../watchlist/WatchlistToggleButton";

const MovieDetailsPage = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const id = Number(movieId);

    const loadMovie = async () => {
      setLoading(true);
      setError(null);
      setMovie(null);

      if (!Number.isInteger(id) || id < 1) {
        setError("This movie could not be found.");
        setLoading(false);
        return;
      }

      try {
        const result = await getMovieDetails(id);
        if (!cancelled) {
          setMovie(result);
          try {
            recordRecentMovie(id);
          } catch (storageError) {
            console.error("Could not save recently viewed movie:", storageError);
          }
        }
      } catch (requestError) {
        console.error("Failed to load movie details:", requestError);
        if (!cancelled) {
          setError("Could not load this movie. Please try again later.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadMovie();

    return () => {
      cancelled = true;
    };
  }, [movieId, retry]);

  const trailer =
    movie && "videos" in movie
      ? movie.videos?.results?.find(
          (video) => video.site === "YouTube" && video.type === "Trailer",
        )
      : undefined;
  const releaseYear = movie?.release_date
    ? new Date(`${movie.release_date}T00:00:00`).getFullYear()
    : null;
  const runtime = movie?.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null;

  return (
    <section className="custom-scrollbar relative h-dvh min-h-0 min-w-0 flex-1 overflow-y-auto bg-gray-800 px-6 pb-12 sm:px-10">
      <Header />
      <main className="pt-8">
        <Link
          to="/"
          className="my-4 inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-cyan-300"
        >
          <ArrowLeft size={18} />
          Back to movies
        </Link>

        {loading ? (
          <p role="status" className="py-24 text-center text-white/70">
            Loading movie details...
          </p>
        ) : error || !movie ? (
          <div role="alert" className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white">
            <h1 className="text-2xl font-bold">Movie unavailable</h1>
            <p className="mt-2 text-white/65">{error ?? "This movie could not be found."}</p>
            {Number.isInteger(Number(movieId)) && Number(movieId) > 0 && (
              <button
                type="button"
                onClick={() => setRetry((count) => count + 1)}
                className="mt-5 rounded-lg bg-white/10 px-4 py-2 font-semibold text-white hover:bg-white/15"
              >
                Try again
              </button>
            )}
          </div>
        ) : (
          <>
            <section
              aria-labelledby="movie-title"
              className="relative isolate flex min-h-90 items-end overflow-hidden rounded-3xl bg-gray-900 bg-cover bg-center p-6 sm:min-h-105 sm:p-10"
              style={{
                backgroundImage: movie.backdrop_path
                  ? `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`
                  : undefined,
              }}
            >
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-950 via-gray-950/65 to-gray-950/10" />
              <div className="max-w-3xl">
                {movie.tagline && (
                  <p className="mb-3 text-sm font-semibold italic text-cyan-200 sm:text-base">
                    {movie.tagline}
                  </p>
                )}
                <h1 id="movie-title" className="text-4xl font-extrabold text-white sm:text-6xl">
                  {movie.title}
                </h1>

                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-white/80">
                  {releaseYear && (
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays size={17} className="text-cyan-300" />
                      {releaseYear}
                    </span>
                  )}
                  {runtime && (
                    <span className="inline-flex items-center gap-2">
                      <Clock3 size={17} className="text-cyan-300" />
                      {runtime}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-2">
                    <Star size={17} className="fill-amber-300 text-amber-300" />
                    {movie.vote_average.toFixed(1)} / 10
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="rounded-full border border-white/20 bg-black/25 px-3 py-1 text-xs font-semibold text-white/90"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>

                <div className="mt-7 flex flex-wrap items-start gap-3">
                  <WatchlistToggleButton movieId={movie.id} />
                  {trailer && (
                    <a
                      href={`https://www.youtube.com/watch?v=${encodeURIComponent(trailer.key)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-black/40 px-5 py-3 font-bold text-white transition hover:bg-black/60"
                    >
                      <Play size={18} fill="currentColor" />
                      Watch trailer
                    </a>
                  )}
                </div>
              </div>
            </section>

            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
              <div>
                <section aria-labelledby="overview-heading">
                  <h2 id="overview-heading" className="text-xl font-bold text-white">
                    Overview
                  </h2>
                  <p className="mt-3 max-w-3xl leading-7 text-white/70">
                    {movie.overview || "No overview is available for this movie yet."}
                  </p>
                </section>

                <section aria-labelledby="cast-heading" className="mt-8">
                  <h2 id="cast-heading" className="text-xl font-bold text-white">
                    Top cast
                  </h2>
                  {movie.credits.cast.length > 0 ? (
                    <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-2">
                      {movie.credits.cast.slice(0, 8).map((person) => (
                        <li
                          key={person.id}
                          className="flex min-w-0 items-center gap-3 rounded-xl border border-white/8 bg-white/5 p-3"
                        >
                          {person.profile_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                              alt=""
                              className="h-12 w-12 shrink-0 rounded-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <span
                              aria-hidden="true"
                              className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-cyan-300/15 font-bold text-cyan-200"
                            >
                              {person.name.charAt(0)}
                            </span>
                          )}
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold text-white">
                              {person.name}
                            </span>
                            <span className="mt-0.5 block truncate text-xs text-white/50">
                              {person.character || "Cast"}
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-sm text-white/55">Cast information is not available.</p>
                  )}
                </section>
              </div>

              {movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={`${movie.title} poster`}
                  className="hidden w-full self-start rounded-2xl shadow-2xl shadow-black/30 lg:block"
                  loading="lazy"
                />
              )}
            </div>
          </>
        )}
      </main>
    </section>
  );
};

export default MovieDetailsPage;
