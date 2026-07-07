import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import useRegister from "../hooks/useRegister.ts";

type AccountType = "influencer" | "brand";

export function RegisterPage() {
    const { register, loading } = useRegister();
    const [accountType, setAccountType] = useState<AccountType>("influencer");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [companyName, setCompanyName] = useState("");

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (accountType === "influencer") {
            await register({ accountType: "influencer", data: { email, password, displayName } });
        } else {
            await register({ accountType: "brand", data: { email, password, companyName } });
        }
    }

    return (
        <div className="auth-page">
            <h1>Create an account</h1>

            <div className="toggle">
                <button
                    type="button"
                    className={accountType === "influencer" ? "active" : ""}
                    onClick={() => setAccountType("influencer")}
                >
                    I'm an Influencer
                </button>
                <button
                    type="button"
                    className={accountType === "brand" ? "active" : ""}
                    onClick={() => setAccountType("brand")}
                >
                    I'm a Brand
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <label>
                    Email
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <label>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                    />
                </label>

                {accountType === "influencer" ? (
                    <label>
                        Display name
                        <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
                    </label>
                ) : (
                    <label>
                        Company name
                        <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
                    </label>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? "Creating account..." : "Create account"}
                </button>
            </form>

            <p>
                Already have an account? <Link to="/login">Log in</Link>
            </p>
        </div>
    );
}