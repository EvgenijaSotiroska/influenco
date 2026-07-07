export type UserRole = "Influencer" | "Brand" | "Admin";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterInfluencerRequest {
    email: string;
    password: string;
    displayName: string;
}

export interface RegisterBrandRequest {
    email: string;
    password: string;
    companyName: string;
}

export interface AuthResponse {
    userId: string;
    email: string;
    role: UserRole;
    profileId: string | null;
    token: string;
    expiresAt: string;
}
export interface UserPayload {
    userId: string;
    email: string;
    role: UserRole;
    profileId: string | null;
}