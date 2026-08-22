import axios from "../axios/axios";
import type { Deal, CreateDealRequest } from "./types/deal";

const dealApi = {
    async create(data: CreateDealRequest): Promise<Deal> {
        const response = await axios.post("/deals", data);
        return response.data;
    },

    async getForInfluencer(influencerId: string): Promise<Deal[]> {
        const response = await axios.get(`/deals/influencer/${influencerId}`);
        return response.data;
    },

    async getMyDeals(): Promise<Deal[]> {
        const response = await axios.get("/deals/my-deals");
        return response.data;
    },

    async verify(dealId: string) {
        await axios.put(`/deals/${dealId}/verify`);
    },
};

export default dealApi;