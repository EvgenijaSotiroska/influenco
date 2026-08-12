import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import campaignApi from "../api/campaignApi";
import type { CampaignFormData } from "../api/types/campaign";

const emptyForm: CampaignFormData = {
    title: "",
    description: "",
    deliverables: "",
    budget: undefined,
    applicationDeadline: "",
    status: "OpenForApplications",
    niches: [],
    platforms: [],
    minimumFollowers: undefined,
};

export default function useCampaignForm() {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [form, setForm] = useState<CampaignFormData>(emptyForm);
    const [loading, setLoading] = useState(isEditMode);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                const data = await campaignApi.getById(id!);
                if (!cancelled) {
                    setForm({
                        title: data.title,
                        description: data.description ?? "",
                        deliverables: data.deliverables ?? "",
                        budget: data.budget,
                        applicationDeadline: data.applicationDeadline
                            ? data.applicationDeadline.split("T")[0]
                            : "",
                        status: data.status,
                        niches: data.niches,
                        platforms: data.platforms,
                        minimumFollowers: data.minimumFollowers,
                    });
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [id]);

    async function save() {
        setSaving(true);
        setError(null);
        try {
            if (isEditMode) {
                await campaignApi.update(id!, form);
            } else {
                await campaignApi.create(form);
            }
            navigate("/brand/campaigns");
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Something went wrong while saving. Please try again."
            );
        } finally {
            setSaving(false);
        }
    }

    return { form, setForm, loading, saving, error, save, isEditMode };
}