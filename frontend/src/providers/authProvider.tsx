import { useState, type ReactNode } from "react";
import AuthContext from "../context/authContext.ts";
import type { UserPayload } from "../api/types/auth.ts";
import { decodeToken } from "../utils/jwt.ts";

function buildUserFromToken(token: string): UserPayload | null {
    const claims = decodeToken(token);
    if (!claims) return null;

    return {
        userId: claims.sub as string,
        email: claims.email as string,
        role: claims.role as UserPayload["role"],
        profileId: (claims.profileId as string | undefined) ?? null,
    };
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserPayload | null>(() => {
        const token = localStorage.getItem("token");
        return token ? buildUserFromToken(token) : null;
    });

    function login(jwtToken: string) {
        localStorage.setItem("token", jwtToken);
        setUser(buildUserFromToken(jwtToken));
    }

    function logout() {
        localStorage.removeItem("token");
        setUser(null);
    }

    return (
        <AuthContext.Provider value= {{ user, login, logout, isLoggedIn: !!user }
}>
    { children }
    </AuthContext.Provider>
  );
}