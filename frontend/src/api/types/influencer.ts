export interface InfluencerProfile {
    id: string;
    displayName: string;
    handle: string;
    bio: string;
    profilePictureUrl?: string;
    coverImageUrl?: string;
    location?: string;
    categories: string[];
    isVerified: boolean;
}

export interface UpdateInfluencerProfileRequest {
    displayName: string;
    handle: string;
    bio: string;
    location?: string;
    categories: string[];
}