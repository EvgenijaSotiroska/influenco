import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import useBrandProfile from "../../hooks/useBrandProfile";
import type { BrandProfile } from "../../api/types/brand";
import "./BrandProfilePage.css";

const emptyProfile: BrandProfile = {
    id: "",
    companyName: "",
    description: "",
    logoUrl: "",
    website: "",
    industry: "",
};

export function BrandProfilePage() {
    const {
        profile,
        setProfile,
        loading,
        saving,
        saveProfile,
    } = useBrandProfile();

    const navigate = useNavigate();

    const [error, setError] = useState<string | null>(null);

    const currentProfile = profile ?? emptyProfile;


    if (loading) {
        return (
            <div className="brand-loading">
                Loading...
            </div>
        );
    }


    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setProfile({
            ...currentProfile,
            [e.target.name]: e.target.value,
        });
    };


    const initials = currentProfile.companyName
        .split(" ")
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase();



    const handleSave = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            await saveProfile({
                companyName: currentProfile.companyName,
                description: currentProfile.description,
                logoUrl: currentProfile.logoUrl,
                website: currentProfile.website,
                industry: currentProfile.industry,
            });

        } catch (err: any) {
            console.error(err);

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to save profile."
            );
        }

        navigate("/brand/profile/preview");
    };



    return (

        <form
            className="brand-form"
            onSubmit={handleSave}
        >


            <div className="brand-header">

                <div>
                    <span className="brand-label">
                        BRAND
                    </span>

                    <h1>
                        Company profile.
                    </h1>

                    <p>
                        This is what creators see when viewing your brand.
                    </p>
                </div>


                <button
                    className="brand-save-button"
                    type="submit"
                    disabled={saving}
                >
                    {saving ? "Saving..." : "Save changes"}
                </button>

            </div>




            {error && (
                <div className="brand-error">
                    {error}
                </div>
            )}




            <div className="brand-columns">


                {/* LEFT COLUMN */}
                <div className="brand-company-box">


                    <h2>
                        Company information
                    </h2>



                    <label>
                        Company name

                        <input
                            name="companyName"
                            value={currentProfile.companyName}
                            onChange={handleChange}
                        />

                    </label>




                    <label>
                        Website

                        <input
                            name="website"
                            value={currentProfile.website ?? ""}
                            placeholder="https://..."
                            onChange={handleChange}
                        />

                    </label>




                    <label>
                        Industry

                        <input
                            name="industry"
                            value={currentProfile.industry ?? ""}
                            onChange={handleChange}
                        />

                    </label>




                    <label>
                        Description

                        <textarea
                            name="description"
                            value={currentProfile.description ?? ""}
                            onChange={handleChange}
                        />

                    </label>


                </div>





                {/* RIGHT COLUMN */}
                <div className="brand-logo-box">


                    <h2>
                        Logo
                    </h2>



                    <div
                        className="brand-logo-preview"
                        style={
                            currentProfile.logoUrl
                                ? {
                                    backgroundImage:
                                        `url(${currentProfile.logoUrl})`
                                }
                                : undefined
                        }
                    >

                        {!currentProfile.logoUrl && (
                            <span>
                                {initials || "?"}
                            </span>
                        )}

                    </div>




                    <label>

                        Logo image URL


                        <input
                            name="logoUrl"
                            value={currentProfile.logoUrl ?? ""}
                            placeholder="https://example.com/logo.png"
                            onChange={handleChange}
                        />


                    </label>



                </div>


            </div>


        </form>

    );
}