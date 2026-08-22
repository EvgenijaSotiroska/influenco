export interface Deal {
    id: string;
    brandName: string;
    brandLogoUrl?: string;
    influencerName: string;
    influencerProfilePictureUrl?: string;
    title: string;
    deliverables: string[];
    price: number;
    isVerified: boolean;
    createdAt: string;
}

export interface CreateDealRequest {
    influencerId: string;
    campaignId?: string;
    campaignApplicationId?: string;
    collaborationRequestId?: string;
    title: string;
    deliverables: string[];
    price: number;
}