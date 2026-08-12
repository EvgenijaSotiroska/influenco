import axios from "../axios/axios";
import type {
    BrowseCampaign,
    BrowseCampaignsFilters,
    ApplyToCampaignRequest,
} from "./types/browseCampaign";

const browseCampaignsApi = {
    async browse(filters: BrowseCampaignsFilters): Promise<BrowseCampaign[]> {
        const response = await axios.get("/browse-campaigns", { params: filters });
        return response.data.campaigns;
    },

    async apply(campaignId: string, data: ApplyToCampaignRequest) {
        await axios.post(`/browse-campaigns/${campaignId}/apply`, data);
    },
};

export default browseCampaignsApi;