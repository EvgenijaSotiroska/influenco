export type CampaignStatus = "Draft" | "OpenForApplications" | "Closed";

export interface Campaign {
    id: string;
    title: string;
    description?: string;
    deliverables?: string;
    budget?: number;
    applicationDeadline?: string;
    status: CampaignStatus;
    niches: string[];
    platforms: string[];
    minimumFollowers?: number;
    applicantsCount: number;
    createdAt: string;
}

export interface CampaignSummary {
    id: string;
    title: string;
    applicantsCount: number;
    applicationDeadline?: string;
    status: CampaignStatus;
}

export interface CampaignFormData {
    title: string;
    description?: string;
    deliverables?: string;
    budget?: number;
    applicationDeadline?: string;
    status: CampaignStatus;
    niches: string[];
    platforms: string[];
    minimumFollowers?: number;
}