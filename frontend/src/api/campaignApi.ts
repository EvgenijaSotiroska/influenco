import axios from "../axios/axios";
import type { Campaign, CampaignSummary, CampaignFormData } from "./types/campaign";
import type { CampaignApplicants, RespondToApplicationRequest } from "./types/applicant";
import type { RequestedInfluencer } from "./types/incomingRequests";

const campaignApi = {
    async create(data: CampaignFormData): Promise<Campaign> {
        const response = await axios.post("/campaigns", data);
        return response.data;
    },

    async getAll(): Promise<CampaignSummary[]> {
        const response = await axios.get("/campaigns");
        return response.data;
    },

    async getById(id: string): Promise<Campaign> {
        const response = await axios.get(`/campaigns/${id}`);
        return response.data;
    },

    async update(id: string, data: CampaignFormData) {
        await axios.put(`/campaigns/${id}`, data);
    },

    async remove(id: string) {
        await axios.delete(`/campaigns/${id}`);
    },
    async getApplicants(campaignId: string): Promise<CampaignApplicants> {
        const response = await axios.get(`/campaigns/${campaignId}/applicants`);
        return response.data;
    },

    async respondToApplicant(
        campaignId: string,
        applicationId: string,
        data: RespondToApplicationRequest
    ) {
        await axios.put(`/campaigns/${campaignId}/applicants/${applicationId}`, data);
    },

    async getRequestedInfluencers(campaignId: string): Promise<RequestedInfluencer[]> {
        const response = await axios.get(`/campaigns/${campaignId}/requested-influencers`);
        return response.data;
    },
};

export default campaignApi;