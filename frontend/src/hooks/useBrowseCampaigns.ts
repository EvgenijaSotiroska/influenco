import { useCallback, useEffect, useState } from "react";
import browseCampaignsApi from "../api/browseCampaignsApi";
import type { BrowseCampaign, BrowseCampaignsFilters } from "../api/types/browseCampaign";

export default function useBrowseCampaigns(filters: BrowseCampaignsFilters) {
    const [campaigns, setCampaigns] = useState<BrowseCampaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const filtersKey = JSON.stringify(filters);

    const load = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await browseCampaignsApi.browse(filters);
            setCampaigns(data);
        } catch (err) {
            console.error(err);
            setError("Couldn't load campaigns right now.");
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filtersKey]);

    useEffect(() => {
        load();
    }, [load]);

    return { campaigns, loading, error, reload: load };
}