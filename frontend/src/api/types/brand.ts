export interface BrandProfile {
    id: string;
    companyName: string;
    description?: string;
    logoUrl?: string;
    website?: string;
    industry?: string;
}

export interface UpdateBrandProfileRequest {
    companyName: string;
    description?: string;
    logoUrl?: string;
    website?: string;
    industry?: string;
}