import axios from "../axios/axios";
import type { BrandProfile, UpdateBrandProfileRequest } from "./types/brand";
import type { CampaignSummary } from "./types/campaign";

const brandApi = {
    async getProfile(): Promise<BrandProfile> {
        const response = await axios.get("/brand/profile");
        return response.data;
    },

    async updateProfile(data: UpdateBrandProfileRequest) {
        await axios.put("/brand/profile", data);
    },
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
    async getById(id: string): Promise<BrandProfile> {
        const response = await axios.get(`/brand/${id}`);
        return response.data;
    },
<<<<<<< Updated upstream
    async getActiveCampaigns(brandId: string): Promise<CampaignSummary[]> {
        const response = await axios.get(`/brand/${brandId}/campaigns`);
        return response.data;
    },
=======
>>>>>>> Stashed changes
};

export default brandApi;