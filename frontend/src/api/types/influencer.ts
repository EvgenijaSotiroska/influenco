export interface InfluencerProfile {
    id: string;
    displayName: string;
    handle: string;
    bio?: string;
    profilePictureUrl?: string;
    coverImageUrl?: string;
    location?: string;
    categories: string[];
    isVerified: boolean;

    instagramUrl?: string;
    instagramFollowers?: number;
    instagramAvgViews?: number;
    instagramStoryViews?: number;

    tikTokUrl?: string;
    tikTokFollowers?: number;
    tikTokAvgViews?: number;

    audienceAgeRange?: string;
    audienceGenderSplit?: string;
    audienceTopLocations?: string;

    statsUpdatedAt?: string;

    totalReach: number;
    instagramEngagementRate?: number;
    tikTokEngagementRate?: number;
    overallEngagementRate?: number;
}

export interface UpdateInfluencerProfileRequest {
    displayName: string;
    handle: string;
    bio?: string;
    location?: string;
    categories: string[];
    profilePictureUrl?: string;
    coverImageUrl?: string;

    instagramUrl?: string;
    instagramFollowers?: number;
    instagramAvgViews?: number;
    instagramStoryViews?: number;

    tikTokUrl?: string;
    tikTokFollowers?: number;
    tikTokAvgViews?: number;

    audienceAgeRange?: string;
    audienceGenderSplit?: string;
    audienceTopLocations?: string;
}