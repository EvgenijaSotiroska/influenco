export interface BrandCampaignOption {
    id: string;
    title: string;
}

export interface CreateCollaborationRequest {
    influencerId: string;
    campaignId?: string;
    deliverables: string[];
    offeredBudget?: number;
    timeline?: string;
    message?: string;
}