import axios from "../axios/axios";
import type {
    BrandCampaignOption,
    CreateCollaborationRequest,
} from "./types/collaborationRequest";
import type { IncomingCollaborationRequest } from "./types/incomingRequests";

const collaborationRequestApi = {
    async getActiveCampaigns(): Promise<BrandCampaignOption[]> {
        const response = await axios.get("/collaboration-requests/my-active-campaigns");
        return response.data;
    },

    async create(data: CreateCollaborationRequest) {
        await axios.post("/collaboration-requests", data);
    },
    async getMyRequests(): Promise<IncomingCollaborationRequest[]> {
        const response = await axios.get("/collaboration-requests/my-requests");
        return response.data;
    },

    async respond(requestId: string, status: "Accepted" | "Declined") {
        await axios.put(`/collaboration-requests/${requestId}/respond`, { status });
    },

    async getPendingCount(): Promise<number> {
        const response = await axios.get("/collaboration-requests/pending-count");
        return response.data.count;
    },
};

export default collaborationRequestApi;