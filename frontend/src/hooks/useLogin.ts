import { useState } from "react";
import type { LoginRequest } from "../types/auth.ts";
import userApi from "../api/authApi.ts";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth.ts";
import useSnackbar from "./useSnackbar.ts";

const useLogin = () => {
    const navigate = useNavigate();
    const { login: authLogin } = useAuth();
    const { showSnackbar } = useSnackbar();
    const [loading, setLoading] = useState<boolean>(false);

    const login = async (data: LoginRequest) => {
        setLoading(true);

        try {
            const response = await userApi.login(data);
            authLogin(response.data.token);
            navigate("/");
        } catch (err) {
            showSnackbar(err instanceof Error ? err.message : "Login failed. Please try again!", "error");
        } finally {
            setLoading(false);
        }
    };

    return { loading, login };
};

export default useLogin;