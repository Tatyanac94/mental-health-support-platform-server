export interface PostLike {
    id: number;
    postId: number; 
    commentId?: number;
    timestamp: string; 
  }
  
  export interface CreatePostLikeRequest {
    postId: number; 
  }
  
  export interface CreateCommentLikeRequest {
    commentId: number; 
  }
  
  export interface CreateLikeResponse {
    id: number;
    postId: number; 
    commentId?: number;
    timestamp: string;
  }
  