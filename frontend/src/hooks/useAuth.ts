import { useContext } from "react";
import AuthContext, { type AuthContextType } from "../context/authContext.ts";

const useAuth = () => useContext<AuthContextType>(AuthContext);

export default useAuth;