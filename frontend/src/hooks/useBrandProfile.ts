import { useEffect, useState } from "react";
import brandApi from "../api/brandApi";
import type { BrandProfile, UpdateBrandProfileRequest } from "../api/types/brand";

export default function useBrandProfile() {
    const [profile, setProfile] = useState<BrandProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                const data = await brandApi.getProfile();
                if (!cancelled) setProfile(data);
            } catch {
                if (!cancelled) setProfile(null);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    async function saveProfile(data: UpdateBrandProfileRequest) {
        setSaving(true);
        try {
            await brandApi.updateProfile(data);
            setProfile((prev) => (prev ? { ...prev, ...data } : { id: "", ...data }));
        } finally {
            setSaving(false);
        }
    }

    return { profile, setProfile, loading, saving, saveProfile };
}