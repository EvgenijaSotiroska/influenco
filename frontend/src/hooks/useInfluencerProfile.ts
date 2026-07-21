import { useEffect, useState } from "react";
import influencerApi from "../api/influencerApi";
import type {
    InfluencerProfile,
    UpdateInfluencerProfileRequest
} from "../api/types/influencer.ts";

const useInfluencerProfile = () => {

    const [profile, setProfile] =
        useState<InfluencerProfile | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState<string>();

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {

        try {

            setLoading(true);

            const data =
                await influencerApi.getProfile();

            setProfile(data);

        } catch {

            setError("Failed to load profile.");

        } finally {

            setLoading(false);
        }
    };

    const saveProfile = async (
        request: UpdateInfluencerProfileRequest
    ) => {

        try {

            setSaving(true);

            await influencerApi.updateProfile(request);

            setProfile(prev =>
                prev
                    ? {
                        ...prev,
                        ...request
                    }
                    : prev
            );

        } finally {

            setSaving(false);
        }
    };

    return {
        profile,
        setProfile,
        loading,
        saving,
        error,
        saveProfile
    };
};

export default useInfluencerProfile;