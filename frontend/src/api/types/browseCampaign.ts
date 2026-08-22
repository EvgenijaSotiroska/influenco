export interface BrowseCampaign {
    id: string;
    brandName: string;
    brandId: string;
    brandLogoUrl?: string;
    title: string;
    description?: string;
    budget?: number;
    minimumFollowers?: number;
    applicationDeadline?: string;
    status: string;
    niches: string[];
    platforms: string[];
    applicantsCount: number;
    hasApplied: boolean;
}

export interface BrowseCampaignsFilters {
    niche?: string;
    platform?: string;
    minBudget?: number;
    maxBudget?: number;
}

export interface ApplyToCampaignRequest {
    pitchMessage?: string;
    proposedRate?: number;
}