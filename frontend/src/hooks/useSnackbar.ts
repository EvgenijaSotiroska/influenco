import { useContext } from "react";
import SnackbarContext, { type SnackbarContextType } from "../context/snackbarContext.ts";

const useSnackbar = () => useContext<SnackbarContextType>(SnackbarContext);

export default useSnackbar;