import { useEffect, useState } from "react";
import influencerApi from "../api/influencerApi";
import { withFakeStats } from "../utils/fakeStats";
import type { DiscoverInfluencerWithStats } from "../api/types/discover.ts";

export function useDiscoverInfluencers(count: number = 6) {
    const [influencers, setInfluencers] = useState<DiscoverInfluencerWithStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                const data = await influencerApi.discoverProfies(count);
                if (!cancelled) {
                    setInfluencers(data.influencers.map(withFakeStats));
                    setError(null);
                }
            } catch (err) {
                console.error("Discover load error:", err);
                if (!cancelled) setError("Couldn't load creators right now.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [count]);

    return { influencers, loading, error };
}