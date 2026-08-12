export interface Applicant {
    applicationId: string;
    influencerId: string;
    displayName: string;
    handle: string;
    profilePictureUrl?: string;
    email: string;
    totalFollowers: number;
    overallEngagementRate: number | null;
    pitchMessage?: string;
    proposedRate?: number;
    status: "Pending" | "Accepted" | "Rejected";
    brandResponseMessage?: string;
}

export interface CampaignApplicants {
    campaignId: string;
    campaignTitle: string;
    applicants: Applicant[];
}

export interface RespondToApplicationRequest {
    status: "Accepted" | "Rejected";
    responseMessage?: string;
}