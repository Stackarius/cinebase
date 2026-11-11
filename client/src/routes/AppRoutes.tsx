import { Route, Routes } from "react-router-dom";
import LoginPage from "../features/auth/LoginPage";
import RegisterPage from "../features/auth/RegisterPage";
import HomePage from "../features/home/HomePage";
import ProtectedRoutes from "./ProtectedRoutes";
import App from "../App";
import MovieDetailsPage from "../features/movies/MovieDetailsPage";
import DiscoverPage from "../features/home/DiscoverPage";
import RecentPage from "../features/home/RecentPage";
import WatchlistPage from "../features/home/WatchlistPage";
import SettingsPage from "../features/home/SettingsPage";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<ProtectedRoutes />}>
                <Route element={<App />}>
                    <Route index element={<HomePage />} />
                    <Route path="movies/:movieId" element={<MovieDetailsPage />} />
                    <Route path="discover" element={<DiscoverPage />} />
                    <Route path="recent" element={<RecentPage />} />
                    <Route path="watchlist" element={<WatchlistPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                </Route>
            </Route>
        </Routes>
    )
}

export default AppRoutes