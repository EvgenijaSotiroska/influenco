export interface DiscoverInfluencer {
    id: string;
    displayName: string;
    handle: string;
    profilePictureUrl: string | null;
    location: string | null;
    niche: string | null;
    isVerified: boolean;
}

export interface DiscoverInfluencersResponse {
    influencers: DiscoverInfluencer[];
    totalCount: number;
}

// Client-only fake stats, generated per render session
export interface DiscoverInfluencerWithStats extends DiscoverInfluencer {
    platform: string;
    followerCount: number;
    engagementRate: number;
}