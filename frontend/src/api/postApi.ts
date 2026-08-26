import axios from "../axios/axios";
import type { Post, CreatePostRequest } from "./types/post";

const postApi = {
    async create(data: CreatePostRequest): Promise<Post> {
        const response = await axios.post("/posts", data);
        return response.data;
    },

    async getForInfluencer(influencerId: string): Promise<Post[]> {
        const response = await axios.get(`/posts/influencer/${influencerId}`);
        return response.data;
    },

    async getForBrand(brandId: string): Promise<Post[]> {
        const response = await axios.get(`/posts/brand/${brandId}`);
        return response.data;
    },
};

export default postApi;
