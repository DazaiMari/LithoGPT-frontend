import { http } from "./http.ts";

// 1. 上传图片
export const forumUpload = (data: FormData) =>
  http.post("/forum/upload", data);

// 2. 创建帖子
export const forumCreatePost = (data: {
  title: string;
  content: string;
  imageUrls?: string[];
}) => http.post("/forum/create", data);

// 3. 获取帖子列表（分页）
export const forumList = (params: {
  current?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: string;
}) => http.get("/forum/list", { params });

// 4. 获取个人帖子列表（分页）
export const forumListPersonal = (params: {
  current?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: string;
}) => http.get("/forum/list/personal", { params });

// 5. 创建评论
export const forumCreateComment = (data: {
  postId: string;
  content: string;
}) => http.post("/forum/comment/create", data);

// 6. 获取帖子评论
export const forumGetComments = (postId: string) =>
  http.get(`/forum/post/${postId}/comments`);

// 7. 点赞帖子
export const forumTogglePostLike = (postId: string) =>
  http.post(`/forum/post/${postId}/like`);

// 8. 点赞评论
export const forumToggleCommentLike = (commentId: string) =>
  http.post(`/forum/comment/${commentId}/like`);

// 9. 删除评论
export const forumDeleteComment = (commentId: string) =>
  http.delete(`/forum/comment/${commentId}`);

// 10. 删除帖子
export const forumDeletePost = (postId: string) =>
  http.delete(`/forum/post/${postId}`);
