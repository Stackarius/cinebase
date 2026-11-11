import { useEffect, useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { addToWatchlist, getWatchlist, removeFromWatchlist } from "./watchlist.api";

type WatchlistToggleButtonProps = {
  movieId: number;
};

const WatchlistToggleButton = ({ movieId }: WatchlistToggleButtonProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const checkWatchlist = async () => {
      try {
        const items = await getWatchlist();
        if (!cancelled) setIsSaved(items.some((item) => item.tmdbMovieId === movieId));
      } catch (requestError) {
        console.error("Failed to check watchlist status:", requestError);
        if (!cancelled) setError("Watchlist status could not be checked.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void checkWatchlist();
    return () => {
      cancelled = true;
    };
  }, [movieId]);

  const toggleWatchlist = async () => {
    setSaving(true);
    setError(null);
    try {
      if (isSaved) {
        await removeFromWatchlist(movieId);
        setIsSaved(false);
      } else {
        await addToWatchlist(movieId);
        setIsSaved(true);
      }
    } catch (requestError) {
      console.error("Failed to update watchlist:", requestError);
      setError("Could not update your watchlist. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <span className="inline-flex flex-col items-start">
      <button
        type="button"
        onClick={() => void toggleWatchlist()}
        disabled={loading || saving}
        aria-pressed={isSaved}
        className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 font-bold text-gray-950 transition hover:bg-cyan-200 disabled:cursor-wait disabled:opacity-60"
      >
        {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        {loading ? "Checking..." : saving ? "Saving..." : isSaved ? "In watchlist" : "Add to watchlist"}
      </button>
      {error && <span role="alert" className="mt-2 text-xs text-red-200">{error}</span>}
    </span>
  );
};

export default WatchlistToggleButton;
