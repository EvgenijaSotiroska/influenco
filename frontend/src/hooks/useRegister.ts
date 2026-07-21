import { useState } from "react";
import type { RegisterInfluencerRequest, RegisterBrandRequest } from "../api/types/auth.ts";
import userApi from "../api/authApi.ts";
import { useNavigate } from "react-router-dom";
import useSnackbar from "./useSnackbar.ts";

type RegisterInput =
    | { accountType: "influencer"; data: RegisterInfluencerRequest }
    | { accountType: "brand"; data: RegisterBrandRequest };

const useRegister = () => {
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();
    const [loading, setLoading] = useState<boolean>(false);

    const register = async (input: RegisterInput) => {
        setLoading(true);

        try {
            if (input.accountType === "influencer") {
                await userApi.registerInfluencer(input.data);
            } else {
                await userApi.registerBrand(input.data);
            }
            navigate("/login");
        } catch (err) {
            showSnackbar(err instanceof Error ? err.message : "Registration failed. Please try again!", "error");
        } finally {
            setLoading(false);
        }
    };

    return { loading, register };
};

export default useRegister;