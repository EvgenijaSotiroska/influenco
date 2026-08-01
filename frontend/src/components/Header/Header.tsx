import { Link, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./Header.css";

export function Header() {
    const { isLoggedIn, user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    const profilePath = user?.role === "Brand" ? "/brand/profile/preview" : "/profile/preview";

    return (
        <header className="site-header">
            <div className="site-header-inner">
                <Link to="/" className="brand">
                    Influenco <span className="brand-dot">.</span>
                </Link>

                <nav className="main-nav">
                    {isLoggedIn ? (
                        <>
                            <Link
                                to="/"
                                className={`nav-link ${isActive("/") ? "nav-link-active" : ""}`}
                            >
                                Home
                            </Link>
                            <Link
                                to={profilePath}
                                className={`nav-link ${isActive(profilePath) ? "nav-link-active" : ""}`}
                            >
                                Profile
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/"
                                className={`nav-link ${isActive("/") ? "nav-link-active" : ""}`}
                            >
                                Home
                            </Link>
                            <Link
                                to="/discover"
                                className={`nav-link ${isActive("/discover") ? "nav-link-active" : ""}`}
                            >
                                Discover
                            </Link>
                            <Link
                                to="/for-brands"
                                className={`nav-link ${isActive("/for-brands") ? "nav-link-active" : ""}`}
                            >
                                For brands
                            </Link>
                            <Link
                                to="/for-creators"
                                className={`nav-link ${isActive("/for-creators") ? "nav-link-active" : ""}`}
                            >
                                For creators
                            </Link>
                        </>
                    )}
                </nav>

                <div className="header-actions">
                    {isLoggedIn ? (
                        <button type="button" className="btn btn-solid" onClick={logout}>
                            Log out
                        </button>
                    ) : (
                        <>
                            <Link to="/login" className="link-plain">
                                Sign in
                            </Link>
                            <Link to="/register" className="btn btn-solid">
                                Get started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}