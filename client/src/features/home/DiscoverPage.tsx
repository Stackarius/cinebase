import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import MovieGrid from "../../components/ui/MovieGrid";
import PageContainer from "../../components/layout/PageContainer";
import { getPopularMovies, searchMovies } from "../movies/movies.api";
import type { Movie, MovieList } from "../movies/movie.types";

const DiscoverPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query")?.trim() ?? "";
  const requestedPage = Number(searchParams.get("page") ?? 1);
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const [inputValue, setInputValue] = useState(query);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => setInputValue(query), [query]);

  useEffect(() => {
    let cancelled = false;

    const loadMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const result: MovieList = query
          ? await searchMovies(query, page)
          : await getPopularMovies(page);
        if (!cancelled) {
          setMovies(result.results);
          setTotalPages(Math.min(result.total_pages || 1, 500));
        }
      } catch (requestError) {
        console.error("Failed to load discover movies:", requestError);
        if (!cancelled) setError("Movies could not be loaded. Check your connection and try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadMovies();
    return () => {
      cancelled = true;
    };
  }, [page, query, retry]);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextQuery = inputValue.trim();
    setSearchParams(nextQuery ? { query: nextQuery } : {});
  };

  const changePage = (nextPage: number) => {
    const nextParams: Record<string, string> = { page: String(nextPage) };
    if (query) nextParams.query = query;
    setSearchParams(nextParams);
  };

  return (
    <PageContainer
      title="Discover movies"
      description="Search the movie catalog or browse popular films from TMDB."
    >
      <form onSubmit={submitSearch} className="mb-6 flex flex-col gap-3 sm:flex-row">
        <label htmlFor="discover-query" className="sr-only">Search movies</label>
        <input
          id="discover-query"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="Search by movie title"
          className="min-w-0 flex-1 rounded-xl border border-white/15 bg-gray-900 px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-cyan-300"
        />
        <button
          type="submit"
          className="rounded-xl bg-cyan-300 px-5 py-3 font-bold text-gray-950 transition hover:bg-cyan-200"
        >
          Search
        </button>
      </form>

      <h2 className="mb-4 text-xl font-bold text-white">
        {query ? `Results for “${query}”` : "Popular movies"}
      </h2>
      <MovieGrid
        movies={movies}
        loading={loading}
        error={error}
        emptyMessage={query ? "No movies matched your search." : "No popular movies are available."}
        onRetry={() => setRetry((count) => count + 1)}
      />

      {!loading && !error && movies.length > 0 && (
        <nav aria-label="Movie result pages" className="mt-8 flex items-center justify-center gap-4 text-white">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => changePage(page - 1)}
            className="rounded-lg bg-white/10 px-4 py-2 font-semibold hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-white/65">Page {page} of {totalPages}</span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => changePage(page + 1)}
            className="rounded-lg bg-white/10 px-4 py-2 font-semibold hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </nav>
      )}
    </PageContainer>
  );
};

export default DiscoverPage;
