export interface BrandProfile {
    id: string;
    companyName: string;
    description?: string;
    logoUrl?: string;
    website?: string;
    industry?: string;
    email: string;
    activeCampaignsCount: number;
    dealsCount: number;
}

export interface UpdateBrandProfileRequest {
    companyName: string;
    description?: string;
    logoUrl?: string;
    website?: string;
    industry?: string;
}