export interface IncomingCollaborationRequest {
    requestId: string;
    brandName: string;
    brandLogoUrl?: string;
    campaignTitle?: string;
    deliverables: string[];
    offeredBudget?: number;
    timeline?: string;
    message?: string;
    status: "Pending" | "Accepted" | "Declined";
    createdAt: string;
}

export interface RequestedInfluencer {
    requestId: string;
    influencerId: string;
    displayName: string;
    handle: string;
    profilePictureUrl?: string;
    status: "Pending" | "Accepted" | "Declined";
    offeredBudget?: number;
    createdAt: string;
}