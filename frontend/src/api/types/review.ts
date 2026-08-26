export interface Review {
    id: string;
    brandId: string;
    brandName: string;
    brandLogoUrl?: string;
    rating: number;
    comment?: string;
    createdAt: string;
}

export interface CreateReviewRequest {
    rating: number;
    comment?: string;
}
