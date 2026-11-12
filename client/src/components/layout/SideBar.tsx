import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Home, Disc, CirclePlus, History, Settings, LogOut } from "lucide-react";
import { api } from "../../lib/axios";

const menu = [
    { title: "Home", icon: Home, to: "/" },
    { title: "Discover", icon: Disc, to: "/discover" },
];

const library = [
    { title: "Recent", icon: History, to: "/recent" },
    { title: "Watchlist", icon: CirclePlus, to: "/watchlist" },
];

const general = [
    { title: "Settings", icon: Settings, to: "/settings" },
];

const mobileLinks = [...menu, ...library, ...general];

const SideBar = () => {
    const navigate = useNavigate();
    const [logoutError, setLogoutError] = useState<string | null>(null);

    const renderLinks = (links: typeof menu) => links.map((link) => (
        <li key={link.title} className="mt-1.5">
            <NavLink
                to={link.to}
                end={link.to === "/"}
                aria-label={link.title}
                className={({ isActive }) =>
                    `relative flex w-full items-center justify-center gap-2 rounded-md px-3 py-3 text-left transition-colors lg:justify-start lg:py-2 ${
                        isActive
                            ? "bg-cyan-400/10 text-cyan-300"
                            : "text-white hover:bg-white/10"
                    }`
                }
            >
                {({ isActive }) => (
                    <>
                        <span
                            aria-hidden="true"
                            className={`absolute right-0 top-1/2 w-1 -translate-y-1/2 rounded-l-md bg-cyan-400 transition-all ${
                                isActive ? "h-6" : "h-0"
                            }`}
                        />
                        <link.icon className="h-5 w-5" />
                        <span className="hidden lg:inline">{link.title}</span>
                    </>
                )}
            </NavLink>
        </li>
    ));

    const handleLogout = async () => {
        setLogoutError(null);
        try {
            await api.post("/auth/logout");
            navigate("/login", { replace: true });
        } catch (error) {
            console.error("Failed to log out:", error);
            setLogoutError("Could not log out. Please try again.");
        }
    };

    return (
        <nav aria-label="Primary navigation" className="fixed inset-x-0 bottom-0 z-30 flex h-[calc(4rem+env(safe-area-inset-bottom))] items-center justify-around bg-gray-700 px-1 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgba(0,0,0,0.25)] md:relative md:inset-auto md:h-dvh md:w-20 md:shrink-0 md:flex-col md:items-stretch md:justify-start md:gap-8 md:px-3 md:py-6 md:pb-6 md:shadow-none lg:w-64 lg:px-4 lg:py-8">
            <Link to="/" aria-label="Cinebase home" className="hidden w-fit border-2 border-cyan-700 pl-1 text-2xl font-black text-white md:block">
                <span className="lg:hidden">C</span>
                <span className="hidden lg:inline">Cine<span className="ml-1 bg-cyan-400 px-2 text-gray-800">Base</span></span>
            </Link>

            <ul className="flex w-full items-center justify-around md:hidden">
                {mobileLinks.map((link) => (
                    <li key={link.title} className="min-w-0 flex-1">
                        <NavLink
                            to={link.to}
                            end={link.to === "/"}
                            aria-label={link.title}
                            className={({ isActive }) =>
                                `flex min-w-0 flex-col items-center gap-1 rounded-md px-1 py-2 text-[9px] font-medium leading-none transition-colors ${
                                    isActive ? "text-cyan-300" : "text-white/80"
                                }`
                            }
                        >
                            <link.icon className="h-5 w-5" aria-hidden="true" />
                            <span className="truncate">{link.title}</span>
                        </NavLink>
                    </li>
                ))}
                <li className="min-w-0 flex-1">
                    <button
                        type="button"
                        onClick={handleLogout}
                        aria-label="Logout"
                        className="flex w-full flex-col items-center gap-1 rounded-md px-1 py-2 text-[9px] font-medium leading-none text-white/80 transition-colors hover:bg-white/10"
                    >
                        <LogOut className="h-5 w-5" aria-hidden="true" />
                        <span>Logout</span>
                    </button>
                </li>
            </ul>

            <div className="hidden w-full flex-col gap-8 md:flex">
                <ul>
                    <li className="hidden text-center text-white/70 lg:mb-2 lg:block lg:text-left">Menu</li>
                    {renderLinks(menu)}
                </ul>

                <ul>
                    <li className="hidden text-center text-white/70 lg:mb-2 lg:block lg:text-left">Library</li>
                    {renderLinks(library)}
                </ul>

                <ul>
                    <li className="hidden text-center text-white/70 lg:mb-2 lg:block lg:text-left">General</li>
                    {renderLinks(general)}
                    <li className="mt-1.5">
                        <button
                            type="button"
                            onClick={handleLogout}
                            aria-label="Logout"
                            className="flex w-full items-center justify-center rounded-md px-3 py-3 text-white transition-colors hover:bg-white/10 lg:justify-start lg:py-2"
                        >
                            <LogOut className="h-5 w-5" />
                            <span className="hidden lg:inline lg:ml-2">Logout</span>
                        </button>
                    </li>
                </ul>
            </div>
            {logoutError && <p role="alert" className="hidden text-sm text-red-300 lg:block">{logoutError}</p>}
        </nav>
    );
};

export default SideBar;
