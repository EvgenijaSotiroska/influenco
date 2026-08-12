import { useCallback, useEffect, useState } from "react";
import campaignApi from "../api/campaignApi";
import type { CampaignSummary } from "../api/types/campaign";

export default function useCampaigns() {
    const [campaigns, setCampaigns] = useState<CampaignSummary[]>([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const data = await campaignApi.getAll();
            setCampaigns(data);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    return { campaigns, loading, reload: load };
}