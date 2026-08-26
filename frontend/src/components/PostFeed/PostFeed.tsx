import { useEffect, useState, type FormEvent } from "react";
import postApi from "../../api/postApi";
import type { Post } from "../../api/types/post";
import "./PostFeed.css";

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

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        const trimmed = content.trim();
        if (!trimmed) return;

        setPosting(true);
        setError(null);

        try {
            const newPost = await postApi.create({ content: trimmed });
            setPosts((prev) => [newPost, ...prev]);
            setContent("");
        } catch (err: any) {
            setError(
                err?.response?.data?.message || err?.message || "Couldn't publish this update."
            );
        } finally {
            setPosting(false);
        }
    }

    return (
        <div className="pf-wrapper">
            {isOwner && (
                <form className="pf-post-box" onSubmit={handleSubmit}>
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
                    <button type="submit" className="pf-post-btn" disabled={posting || !content.trim()}>
                        {posting ? "..." : "Post"}
                    </button>
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
                                <p className="pf-item-content">{post.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
