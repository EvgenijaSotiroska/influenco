export interface MyApplication {
    applicationId: string;
    campaignId: string;
    campaignTitle: string;
    brandName: string;
    brandLogoUrl?: string;
    pitchMessage?: string;
    proposedRate?: number;
    status: "Pending" | "Accepted" | "Rejected";
    brandResponseMessage?: string;
    createdAt: string;
}