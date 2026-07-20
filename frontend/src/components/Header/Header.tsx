import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./Header.css";

export function Header() {
    const { isLoggedIn, logout } = useAuth();

    return (
        <header className="site-header">
            <div className="site-header-inner">
                <Link to="/" className="brand">
                    Influenco <span className="brand-dot">.</span>
                </Link>

                <nav className="main-nav">
                    <Link to="/" className="nav-link nav-link-active">Home</Link>
                    <Link to="/discover" className="nav-link">Discover</Link>
                    <Link to="/for-brands" className="nav-link">For brands</Link>
                    <Link to="/for-creators" className="nav-link">For creators</Link>
                </nav>

                <div className="header-actions">
                    {isLoggedIn ? (
                        <>
                            <Link to="/dashboard" className="link-plain">Dashboard</Link>
                            <button className="btn btn-solid" onClick={logout}>Log out</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="link-plain">Sign in</Link>
                            <Link to="/register" className="btn btn-solid">Get started</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}