import type {
    DiscoverInfluencer,
    DiscoverInfluencerWithStats,
} from "../api/types/discover.ts";

const PLATFORMS = ["TikTok", "Instagram", "YouTube"];

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function withFakeStats(
    influencer: DiscoverInfluencer
): DiscoverInfluencerWithStats {
    return {
        ...influencer,
        platform: PLATFORMS[randomInt(0, PLATFORMS.length - 1)],
        followerCount: randomInt(50_000, 1_000_000),
        engagementRate: Number((Math.random() * 8 + 2).toFixed(1)), // 2.0–10.0%
    };
}