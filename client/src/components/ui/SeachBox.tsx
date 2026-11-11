import { Search } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

const SeachBox = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const searchTerm = query.trim();
    navigate(searchTerm ? `/discover?query=${encodeURIComponent(searchTerm)}` : "/discover");
  };

  return (
    <form onSubmit={submitSearch} role="search" className="flex min-w-0 items-center rounded-xl border border-white/15 bg-gray-900 px-3 focus-within:border-cyan-300">
      <Search className="shrink-0 text-white/60" size={18} aria-hidden="true" />
      <label htmlFor="global-movie-search" className="sr-only">Search movies</label>
      <input
        id="global-movie-search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        type="search"
        placeholder="Search movies"
        className="min-w-0 bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-white/40"
      />
      <button type="submit" className="rounded-lg bg-cyan-300 px-3 py-1.5 text-sm font-bold text-gray-950 hover:bg-cyan-200">
        Search
      </button>
    </form>
  );
};

export default SeachBox;