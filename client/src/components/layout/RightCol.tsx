import { ArrowUpRight, Bell, Bookmark, Clapperboard, Film, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const RightCol = () => {
  return (
    <aside className="flex h-dvh w-[22%] min-w-60 flex-col gap-8 overflow-y-auto border-l border-white/5 bg-gray-900 px-5 py-8 text-white">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/80">
            Your space
          </p>
          <p className="mt-1 text-sm text-white/55">Welcome back</p>
        </div>
        <div className="relative grid h-11 w-11 place-items-center rounded-2xl bg-cyan-300 text-lg font-extrabold text-gray-950 shadow-lg shadow-cyan-950/50">
          S
          <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full border-2 border-gray-900 bg-gray-700 text-white/80">
            <Bell size={16} aria-hidden="true" />
          </span>
        </div>
      </header>

      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-cyan-950  p-5">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-36 rounded-full bg-cyan-400/15 blur-2xl" />
        <div className="relative">
          <div className="mb-5 flex items-center justify-between">
            <span className="rounded-full border border-cyan-200/20 bg-cyan-200/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-cyan-200">
              Tonight's plan
            </span>
            <Clapperboard className="text-cyan-200/80" size={20} />
          </div>
          <h2 className="text-2xl font-extrabold leading-tight">
            Make it a
            <span className="block text-cyan-300">movie night.</span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/65">
            Your next favorite film is just around the corner.
          </p>
          <Link
            to="/discover"
            className="mt-4 flex items-center justify-between rounded-xl bg-cyan-300 px-4 py-3 text-sm font-bold text-gray-950 transition hover:bg-cyan-200"
          >
            Find a movie
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-1 flex items-center gap-2">
          <Sparkles size={16} className="text-cyan-300" />
          <h3 className="text-sm font-bold">Your cinema</h3>
        </div>
        <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.04]">
          <Link
            to="/watchlist"
            className="group flex items-center gap-3 p-4 transition hover:bg-white/[0.06]"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300">
              <Bookmark size={18} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">Watchlist</span>
              <span className="mt-0.5 block text-xs text-white/50">Keep your picks together</span>
            </span>
            <ArrowUpRight
              size={16}
              className="text-white/35 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-300"
            />
          </Link>
        
        </div>
      </section>

      <section className="mt-0 rounded-2xl border border-white/8 bg-white/4 p-4">
        <div className="flex items-start gap-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-300/10 text-amber-200">
            <Film size={17} />
          </span>
          <div>
            <h3 className="text-sm font-semibold">A little cinema magic</h3>
            <p className="mt-1 text-xs leading-relaxed text-white/50">
              Browse, save the ones you love, and build your next double feature.
            </p>
          </div>
        </div>
      </section>
    </aside>
  );
};

export default RightCol;
