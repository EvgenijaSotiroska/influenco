import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import collaborationRequestApi from "../api/collaborationRequestApi";

export default function usePendingRequestsCount() {
    const { isLoggedIn, user } = useAuth();
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isLoggedIn || user?.role !== "Influencer") {
            setCount(0);
            return;
        }

        let cancelled = false;

        async function load() {
            try {
                const result = await collaborationRequestApi.getPendingCount();
                if (!cancelled) setCount(result);
            } catch {
                if (!cancelled) setCount(0);
            }
        }

        load();
        const interval = setInterval(load, 30000); // poll every 30s

        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, [isLoggedIn, user?.role]);

    return count;
}