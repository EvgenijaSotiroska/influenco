import axios from "../axios/axios";
import type { Review, CreateReviewRequest } from "./types/review";

const reviewApi = {
    async create(influencerId: string, data: CreateReviewRequest): Promise<Review> {
        const response = await axios.post(`/reviews/influencer/${influencerId}`, data);
        return response.data;
    },

    async getForInfluencer(influencerId: string): Promise<Review[]> {
        const response = await axios.get(`/reviews/influencer/${influencerId}`);
        return response.data;
    },
};

export default reviewApi;
