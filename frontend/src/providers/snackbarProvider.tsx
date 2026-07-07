import { useCallback, useState, type ReactNode } from "react";
import SnackbarContext, { type SnackbarSeverity } from "../context/snackbarContext.ts";

interface SnackbarState {
    message: string;
    severity: SnackbarSeverity;
}

export function SnackbarProvider({ children }: { children: ReactNode }) {
    const [snackbar, setSnackbar] = useState<SnackbarState | null>(null);

    const showSnackbar = useCallback((message: string, severity: SnackbarSeverity = "info") => {
        setSnackbar({ message, severity });
        setTimeout(() => setSnackbar(null), 4000);
    }, []);

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            {snackbar && (
                <div className={`snackbar snackbar-${snackbar.severity}`} role="status">
                    {snackbar.message}
                </div>
            )}
        </SnackbarContext.Provider>
    );
}