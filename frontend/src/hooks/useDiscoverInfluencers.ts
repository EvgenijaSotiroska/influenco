import { useCallback, useEffect, useState } from "react";
import influencerApi from "../api/influencerApi";
import type { DiscoverFilters, DiscoverInfluencer } from "../api/types/discover.ts";

const PAGE_SIZE = 6;

export function useDiscoverInfluencers(filters: DiscoverFilters) {
    const [influencers, setInfluencers] = useState<DiscoverInfluencer[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const filtersKey = JSON.stringify(filters);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                setError(null);
                const data = await influencerApi.discoverProfiles(1, PAGE_SIZE, filters);
                if (!cancelled) {
                    setInfluencers(data.influencers);
                    setPage(1);
                    setHasMore(data.hasMore);
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filtersKey]);

    const loadMore = useCallback(async () => {
        const nextPage = page + 1;
        try {
            setLoadingMore(true);
            const data = await influencerApi.discoverProfiles(nextPage, PAGE_SIZE, filters);
            setInfluencers((prev) => [...prev, ...data.influencers]);
            setPage(nextPage);
            setHasMore(data.hasMore);
        } catch (err) {
            console.error("Discover load more error:", err);
        } finally {
            setLoadingMore(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, filtersKey]);

    return { influencers, loading, loadingMore, hasMore, error, loadMore };
}