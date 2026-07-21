import { useState } from "react";
import type { LoginRequest } from "../api/types/auth.ts";
import userApi from "../api/authApi.ts";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth.ts";

const useLogin = () => {
    const navigate = useNavigate();
    const { login: authLogin } = useAuth();
    const [loading, setLoading] = useState(false);

    const login = async (data: LoginRequest) => {
        setLoading(true);

        try {
            const response = await userApi.login(data);

            authLogin(response.data.token);
            navigate("/");
        } catch (err: any) {
            if (err.response?.status === 401) {
                throw new Error( "Wrong email or password. Please try again." );
            }

            throw new Error( "Login failed. Please try again." );
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        login,
    };
};

export default useLogin;