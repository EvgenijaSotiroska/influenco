import axiosInstance from "../axios/axios.ts";
import type {
    LoginRequest,
    RegisterInfluencerRequest,
    RegisterBrandRequest,
    AuthResponse,
} from "../types/auth.ts";

const userApi = {
    login: async (data: LoginRequest) => {
        return await axiosInstance.post<AuthResponse>("/auth/login", data);
    },
    registerInfluencer: async (data: RegisterInfluencerRequest) => {
        return await axiosInstance.post<AuthResponse>("/auth/register/influencer", data);
    },
    registerBrand: async (data: RegisterBrandRequest) => {
        return await axiosInstance.post<AuthResponse>("/auth/register/brand", data);
    },
};

export default userApi;