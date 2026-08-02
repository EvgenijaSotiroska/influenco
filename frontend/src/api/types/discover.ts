export interface DiscoverInfluencer {
    id: string;
    displayName: string;
    handle: string;
    profilePictureUrl: string | null;
    location: string | null;
    niche: string | null;
    isVerified: boolean;
    totalFollowers: number;
    overallEngagementRate: number | null;
}

export interface DiscoverInfluencersResponse {
    influencers: DiscoverInfluencer[];
    totalCount: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}

export interface DiscoverFilters {
    location?: string;
    category?: string;
    minFollowers?: number;
    maxFollowers?: number;
}