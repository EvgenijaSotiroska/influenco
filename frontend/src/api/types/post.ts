export interface Post {
    id: string;
    authorName: string;
    authorAvatarUrl?: string;
    content?: string;
    imageUrls: string[];
    createdAt: string;
}

export interface CreatePostRequest {
    content?: string;
    imageUrls?: string[];
}
