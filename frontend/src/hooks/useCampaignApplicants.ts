import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import campaignApi from "../api/campaignApi";
import type { CampaignApplicants } from "../api/types/applicant";

export default function useCampaignApplicants() {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<CampaignApplicants | null>(null);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        try {
            const result = await campaignApi.getApplicants(id);
            setData(result);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        load();
    }, [load]);

    return { campaignId: id!, data, loading, reload: load };
}