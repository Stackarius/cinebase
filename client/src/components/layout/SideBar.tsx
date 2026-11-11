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

const SideBar = () => {
    const navigate = useNavigate();
    const [logoutError, setLogoutError] = useState<string | null>(null);

    const renderLinks = (links: typeof menu) => links.map((link) => (
        <li key={link.title} className="mt-1.5">
            <NavLink
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                    `relative flex w-full items-center gap-2 rounded-md px-3 py-2 text-left transition-colors ${
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
                        <span>{link.title}</span>
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
        <nav aria-label="Sidebar" className="relative flex w-[18%] flex-col gap-10 bg-gray-700 px-4 py-8">
            <Link to="/" className="w-fit border-2 border-cyan-700 pl-1 text-2xl font-black text-white">
                Cine<span className="ml-1 bg-cyan-400 px-2 text-gray-800">Base</span>
            </Link>

            <ul>
                <li className="mb-2 text-white/70">Menu</li>
                {renderLinks(menu)}
            </ul>

            <ul>
                <li className="mb-2 text-white/70">Library</li>
                {renderLinks(library)}
            </ul>

            <ul>
                <li className="mb-2 text-white/70">General</li>
                {renderLinks(general)}
                <li className="mt-1.5">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-white transition-colors hover:bg-white/10"
                    >
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                    </button>
                </li>
            </ul>
            {logoutError && <p role="alert" className="text-sm text-red-300">{logoutError}</p>}
        </nav>
    );
};

export default SideBar;
