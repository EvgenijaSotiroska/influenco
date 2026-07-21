import axios from "../axios/axios";
import type { InfluencerProfile ,UpdateInfluencerProfileRequest} from "./types/influencer.ts";

const influencerApi = {

    async getProfile(): Promise<InfluencerProfile> {
        const response = await axios.get("/influencer/profile");
        return response.data;
    },

    async updateProfile(data: UpdateInfluencerProfileRequest) {
        await axios.put("/influencer/profile", data);
    }
};

export default influencerApi;