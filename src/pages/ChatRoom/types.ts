// 帖子类型
export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  title: string;
  content: string;
  imageUrls: string[];
  createTime: string;
  updateTime: string;
  likeCount?: number;
  commentCount?: number;
  isLiked?: boolean;
}

// 评论类型
export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  likeCount: number;
  isLiked: boolean;
  createTime: string;
}

