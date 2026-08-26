export interface Post {
    id: string;
    authorName: string;
    authorAvatarUrl?: string;
    content: string;
    createdAt: string;
}

export interface CreatePostRequest {
    content: string;
}
