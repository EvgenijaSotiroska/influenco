import { useCallback, useEffect, useState } from "react";
import campaignApi from "../api/campaignApi";
import type { RequestedInfluencer } from "../api/types/incomingRequests";

export default function useRequestedInfluencers(campaignId: string) {
    const [requested, setRequested] = useState<RequestedInfluencer[]>([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const data = await campaignApi.getRequestedInfluencers(campaignId);
            setRequested(data);
        } finally {
            setLoading(false);
        }
    }, [campaignId]);

    useEffect(() => {
        load();
    }, [load]);

    return { requested, loading, reload: load };
}