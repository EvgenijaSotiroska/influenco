import { useEffect, useState, type FormEvent } from "react";
import postApi from "../../api/postApi";
import type { Post } from "../../api/types/post";
import "./PostFeed.css";

const MAX_IMAGES = 3;

interface PostFeedProps {
    profileId: string;
    profileType: "influencer" | "brand";
    isOwner: boolean;
    avatarUrl?: string;
}

export function PostFeed({ profileId, profileType, isOwner, avatarUrl }: PostFeedProps) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState("");
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [imageDraft, setImageDraft] = useState("");
    const [showImageInput, setShowImageInput] = useState(false);
    const [posting, setPosting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                const data =
                    profileType === "influencer"
                        ? await postApi.getForInfluencer(profileId)
                        : await postApi.getForBrand(profileId);
                if (!cancelled) setPosts(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [profileId, profileType]);

    function addImage() {
        const trimmed = imageDraft.trim();
        if (!trimmed || imageUrls.length >= MAX_IMAGES) return;
        setImageUrls((prev) => [...prev, trimmed]);
        setImageDraft("");
    }

    function removeImage(index: number) {
        setImageUrls((prev) => prev.filter((_, i) => i !== index));
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        const trimmedContent = content.trim();
        if (!trimmedContent && imageUrls.length === 0) return;

        setPosting(true);
        setError(null);

        try {
            const newPost = await postApi.create({
                content: trimmedContent || undefined,
                imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
            });
            setPosts((prev) => [newPost, ...prev]);
            setContent("");
            setImageUrls([]);
            setImageDraft("");
            setShowImageInput(false);
        } catch (err: any) {
            setError(
                err?.response?.data?.message || err?.message || "Couldn't publish this update."
            );
        } finally {
            setPosting(false);
        }
    }

    const canSubmit = content.trim() || imageUrls.length > 0;

    return (
        <div className="pf-wrapper">
            {isOwner && (
                <form className="pf-post-box" onSubmit={handleSubmit}>
                    <div className="pf-post-row">
                        <div
                            className="pf-post-avatar"
                            style={avatarUrl ? { backgroundImage: `url(${avatarUrl})` } : undefined}
                        />
                        <input
                            type="text"
                            className="pf-post-input"
                            placeholder="Share an update..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            maxLength={500}
                            disabled={posting}
                        />
                        <button
                            type="button"
                            className={`pf-photo-btn ${showImageInput ? "pf-photo-btn-active" : ""}`}
                            onClick={() => setShowImageInput((v) => !v)}
                            title="Add photo"
                            aria-label="Add photo"
                        >
                            🖼️
                        </button>
                        <button type="submit" className="pf-post-btn" disabled={posting || !canSubmit}>
                            {posting ? "..." : "Post"}
                        </button>
                    </div>

                    {showImageInput && imageUrls.length < MAX_IMAGES && (
                        <div className="pf-image-input-row">
                            <input
                                type="text"
                                className="pf-image-input"
                                placeholder={`Paste an image URL (${imageUrls.length}/${MAX_IMAGES})...`}
                                value={imageDraft}
                                onChange={(e) => setImageDraft(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        addImage();
                                    }
                                }}
                                disabled={posting}
                            />
                            <button
                                type="button"
                                className="pf-image-add-btn"
                                onClick={addImage}
                                disabled={!imageDraft.trim()}
                            >
                                Add
                            </button>
                        </div>
                    )}

                    {imageUrls.length > 0 && (
                        <div className="pf-image-preview-row">
                            {imageUrls.map((url, index) => (
                                <div className="pf-image-preview" key={index}>
                                    <img src={url} alt="Preview" />
                                    <button
                                        type="button"
                                        className="pf-image-remove"
                                        onClick={() => removeImage(index)}
                                        aria-label="Remove image"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </form>
            )}

            {error && <p className="pf-error">{error}</p>}

            {!loading && posts.length > 0 && (
                <div className="pf-list">
                    {posts.map((post) => (
                        <div className="pf-item" key={post.id}>
                            <div
                                className="pf-item-avatar"
                                style={
                                    post.authorAvatarUrl
                                        ? { backgroundImage: `url(${post.authorAvatarUrl})` }
                                        : undefined
                                }
                            />
                            <div className="pf-item-body">
                                <div className="pf-item-header">
                                    <span className="pf-item-author">{post.authorName}</span>
                                    <span className="pf-item-date">
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                {post.content && <p className="pf-item-content">{post.content}</p>}
                                {post.imageUrls.length > 0 && (
                                    <div className={`pf-item-images pf-item-images-${post.imageUrls.length}`}>
                                        {post.imageUrls.map((url, index) => (
                                            <img key={index} className="pf-item-image" src={url} alt="" />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}