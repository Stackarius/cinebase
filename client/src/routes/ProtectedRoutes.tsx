import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { api, SESSION_EXPIRED_EVENT } from "../lib/axios";

type Status = "checking" | "authenticated" | "unauthenticated" | "error";

const ProtectedRoutes = () => {
  const location = useLocation();
  const [status, setStatus] = useState<Status>("checking");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const checkSession = async () => {
      setStatus("checking");

      try {
        await api.get("/users/profile");
        if (!cancelled) setStatus("authenticated");
      } catch (error) {
        if (cancelled) return;

        if (isAxiosError(error) && error.response?.status === 401) {
          setStatus("unauthenticated");
        } else {
          setStatus("error");
        }
      }
    };

    void checkSession();

    return () => {
      cancelled = true;
    };
  }, [retry]);

  useEffect(() => {
    const handleSessionExpired = () => setStatus("unauthenticated");
    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
  }, []);

  if (status === "checking") {
    return <p>Checking your session...</p>;
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (status === "error") {
    return (
      <div role="alert">
        <p>Could not check your session. Check your connection and try again.</p>
        <button type="button" onClick={() => setRetry((count) => count + 1)}>
          Try again
        </button>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoutes;