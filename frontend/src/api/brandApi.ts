import axios from "../axios/axios";
import type { BrandProfile, UpdateBrandProfileRequest } from "./types/brand";

const brandApi = {
    async getProfile(): Promise<BrandProfile> {
        const response = await axios.get("/brand/profile");
        return response.data;
    },

    async updateProfile(data: UpdateBrandProfileRequest) {
        await axios.put("/brand/profile", data);
    },
};

export default brandApi;