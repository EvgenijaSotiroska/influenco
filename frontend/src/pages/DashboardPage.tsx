import useAuth from "../hooks/useAuth.ts";
import { decodeToken } from "../utils/jwt.ts";

export function DashboardPage() {
    const { user, logout } = useAuth();

    if (!user) return null;

    const token = localStorage.getItem("token");
    const claims = token ? decodeToken(token) : null;

    return (
        <div className="dashboard-page">
            <h1>Welcome, {user.email}</h1>
            <p>This page only renders when authenticated - if you can see this, JWT auth is working.</p>

            <h2>Your account</h2>
            <ul>
                <li><strong>User ID:</strong> {user.userId}</li>
                <li><strong>Role:</strong> {user.role}</li>
                <li><strong>Profile ID:</strong> {user.profileId}</li>
            </ul>

            <h2>Raw JWT claims (decoded client-side, for debugging)</h2>
            <pre>{JSON.stringify(claims, null, 2)}</pre>

            <button onClick={logout}>Log out</button>
        </div>
    );
}