import axios from "../axios/axios";
import type { InfluencerProfile, UpdateInfluencerProfileRequest } from "./types/influencer.ts";
import type { DiscoverInfluencersResponse, DiscoverFilters } from "./types/discover.ts";

const influencerApi = {

    async getProfile(): Promise<InfluencerProfile> {
        const response = await axios.get("/influencer/profile");
        return response.data;
    },

    async updateProfile(data: UpdateInfluencerProfileRequest) {
        await axios.put("/influencer/profile", data);
    },

    async discoverProfiles(
        page: number,
        pageSize: number,
        filters: DiscoverFilters
    ): Promise<DiscoverInfluencersResponse> {
        const response = await axios.get("/influencer/discover", {
            params: { page, pageSize, ...filters },
        });
        return response.data;
    },

    async getInfluencerDetail(id: string): Promise<InfluencerProfile> {
        const response = await axios.get(`influencer/discover/${id}`);
        return response.data;
    },

    async updateCoverPosition(position: number) {
        await axios.put("/influencer/profile/cover-position", {
            coverImagePosition: position,
        });
    },
};

export default influencerApi;