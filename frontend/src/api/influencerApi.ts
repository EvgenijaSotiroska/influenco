import axios from "../axios/axios";
import type { InfluencerProfile, UpdateInfluencerProfileRequest } from "./types/influencer.ts";
import type { DiscoverInfluencersResponse } from "./types/discover.ts";

const influencerApi = {

    async getProfile(): Promise<InfluencerProfile> {
        const response = await axios.get("/influencer/profile");
        return response.data;
    },

    async updateProfile(data: UpdateInfluencerProfileRequest) {
        await axios.put("/influencer/profile", data);
    },

    async discoverProfies(count: number = 6): Promise<DiscoverInfluencersResponse> { 
            const response = await axios.get("/influencer/discover", { params: { count } });
            return response.data;
    }
};

export default influencerApi;