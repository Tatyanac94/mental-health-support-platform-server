export interface SupportPost {
    id: number;
    content: string;
    timestamp: string;
  }
  
  export interface CreatePostRequest {
    content: string;
  }
  
  export interface CreatePostResponse {
    id: number;
    content: string;
    timestamp: string;
  }
  
  export interface GetPostsResponse {
    posts: SupportPost[]; // Use the correct interface name
  }
  