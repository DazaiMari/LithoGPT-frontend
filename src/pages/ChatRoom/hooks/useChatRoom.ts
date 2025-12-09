import { useEffect, useState, useRef } from "react";
import {
  forumList,
  forumListPersonal,
  forumCreatePost,
  forumUpload,
  forumGetComments,
  forumCreateComment,
  forumTogglePostLike,
  forumToggleCommentLike,
  forumDeletePost,
  forumDeleteComment,
} from "@/api";
import { toast } from "@/utils/message";
import type { Post, Comment } from "../types";

export function useChatRoom() {
  // 帖子列表状态
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // 个人模式状态 - 只看自己的帖子
  const [isPersonalMode, setIsPersonalMode] = useState(false);

  // 创建帖子模态框状态
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostImages, setNewPostImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // 评论模态框状态
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  // 删除确认弹窗状态
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    type: "post" | "comment";
    id: string;
  }>({ isOpen: false, type: "post", id: "" });

  // 获取帖子列表
  const fetchPosts = async (page: number = 1, personalMode: boolean = isPersonalMode) => {
    try {
      setLoading(true);
      const apiCall = personalMode ? forumListPersonal : forumList;
      const res = await apiCall({
        current: page,
        pageSize: 3,
        sortField: "createTime",
        sortOrder: "descend",
      });
      if (res.data) {
        const postsList: Post[] = res.data.records || [];
        setPosts(postsList);
        setTotalPages(res.data.pages || 1);
        setCurrentPage(page);

        // 批量获取每个帖子的评论数
        const postsWithCommentCount = await Promise.all(
          postsList.map(async (post) => {
            try {
              const commentRes = await forumGetComments(post.id);
              const likeRes = await forumTogglePostLike(post.id);
              return {
                ...post,
                commentCount: commentRes.data?.total || 0,
                likeCount: likeRes.data?.likeCount || 0,
                isLiked: likeRes.data?.isLiked || false,
              };
            } catch {
              return post;
            }
          })
        );
        setPosts(postsWithCommentCount);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  // 上传图片
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("forumImage", file);

    try {
      setUploadingImage(true);
      const res = await forumUpload(formData);
      if (res.data) {
        setNewPostImages([...newPostImages, res.data]);
        toast.success("Image uploaded successfully");
      }
    } catch (error) {
      console.error("Failed to upload post:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    }
  };

  // 创建帖子
  const handleCreatePost = async () => {
    if (!newPostTitle.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (!newPostContent.trim()) {
      toast.error("Please enter content");
      return;
    }

    try {
      setSubmitting(true);
      await forumCreatePost({
        title: newPostTitle,
        content: newPostContent,
        imageUrls: newPostImages,
      });
      toast.success("Post created successfully");
      setIsCreateModalOpen(false);
      setNewPostTitle("");
      setNewPostContent("");
      setNewPostImages([]);
      fetchPosts(1);
    } catch (error) {
      console.error("Failed to create post:", error);
      toast.error("Failed to create post");
    } finally {
      setSubmitting(false);
    }
  };

  // 打开评论模态框
  const handleOpenComments = async (post: Post) => {
    setSelectedPost(post);
    setIsCommentModalOpen(true);
    setLoadingComments(true);

    try {
      const res = await forumGetComments(post.id);
      if (res.data) {
        setComments(res.data.comments || []);
        // 更新当前帖子的评论数
        if (res.data.total !== undefined) {
          setPosts(posts.map(p =>
            p.id === post.id
              ? { ...p, commentCount: res.data.total }
              : p
          ));
        }
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setLoadingComments(false);
    }
  };

  // 关闭评论模态框
  const handleCloseComments = () => {
    setIsCommentModalOpen(false);
    setSelectedPost(null);
    setComments([]);
  };


  // 创建评论
  const handleCreateComment = async () => {
    if (!newComment.trim() || !selectedPost) return;

    try {
      setSubmittingComment(true);
      const res = await forumCreateComment({
        postId: selectedPost.id,
        content: newComment,
      });
      if (res.data) {
        setComments([res.data, ...comments]);
        setNewComment("");
        setPosts(posts.map(p =>
          p.id === selectedPost.id
            ? { ...p, commentCount: (p.commentCount || 0) + 1 }
            : p
        ));
        toast.success("Comment added");
      }
    } catch (error) {
      console.error("Failed to create comment:", error);
      toast.error("Failed to add comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  // 切换个人模式
  const togglePersonalMode = () => {
    const newMode = !isPersonalMode;
    setIsPersonalMode(newMode);
    fetchPosts(1, newMode);
  };

  // 点赞帖子
  const handleLikePost = async (postId: string) => {
    try {
      const res = await forumTogglePostLike(postId);
      if (res.data) {
        setPosts(posts.map(p =>
          p.id === postId
            ? { ...p, likeCount: res.data.likeCount, isLiked: res.data.isLiked }
            : p
        ));
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
      toast.error("Post not found");
    }
  };

  // 点赞评论
  const handleLikeComment = async (commentId: string) => {
    try {
      const res = await forumToggleCommentLike(commentId);
      console.log(res.data);
      if (res.data) {
        setComments(comments.map(c =>
          String(c.id) === commentId
            ? { ...c, likeCount: res.data.likeCount, isLiked: res.data.isLiked }
            : c
        ));
      }
    } catch (error) {
      console.error("Failed to toggle comment like:", error);
    }
  };

  // 打开删除确认弹窗
  const openDeleteConfirm = (type: "post" | "comment", id: string) => {
    setDeleteConfirm({ isOpen: true, type, id });
  };

  // 关闭删除确认弹窗
  const closeDeleteConfirm = () => {
    setDeleteConfirm({ isOpen: false, type: "post", id: "" });
  };

  // 确认删除
  const confirmDelete = async () => {
    const { type, id } = deleteConfirm;
    
    if (type === "comment") {
      try {
        await forumDeleteComment(id);
        setComments(comments.filter(c => String(c.id) !== id));
        // 更新帖子的评论数
        if (selectedPost) {
          setPosts(posts.map(p =>
            p.id === selectedPost.id
              ? { ...p, commentCount: Math.max(0, (p.commentCount || 0) - 1) }
              : p
          ));
        }
        toast.success("Comment deleted");
      } catch (error) {
        console.error("Failed to delete comment:", error);
        toast.error("Failed to delete comment");
      }
    } else {
    try {
        await forumDeletePost(id);
        setPosts(posts.filter(p => p.id !== id));
      toast.success("Post deleted");
    } catch (error) {
      console.error("Failed to delete post:", error);
      toast.error("Failed to delete post");
    }
    }
  };

  // 删除评论（打开确认弹窗）
  const handleDeleteComment = (commentId: string) => {
    openDeleteConfirm("comment", commentId);
  };

  // 删除帖子（打开确认弹窗）
  const handleDeletePost = (postId: string) => {
    openDeleteConfirm("post", postId);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // 移除已上传的图片
  const handleRemoveImage = (index: number) => {
    setNewPostImages(newPostImages.filter((_, i) => i !== index));
  };

  return {
    // 帖子列表
    posts,
    loading,
    currentPage,
    totalPages,
    fetchPosts,
    
    // 个人模式
    isPersonalMode,
    togglePersonalMode,

    // 创建帖子
    isCreateModalOpen,
    setIsCreateModalOpen,
    newPostTitle,
    setNewPostTitle,
    newPostContent,
    setNewPostContent,
    newPostImages,
    uploadingImage,
    submitting,
    imageInputRef,
    handleImageUpload,
    handleCreatePost,
    handleRemoveImage,

    // 评论
    isCommentModalOpen,
    selectedPost,
    comments,
    loadingComments,
    newComment,
    setNewComment,
    submittingComment,
    handleOpenComments,
    handleCloseComments,
    handleCreateComment,
    handleLikeComment,
    handleDeleteComment,

    // 帖子操作
    handleLikePost,
    handleDeletePost,

    // 删除确认弹窗
    deleteConfirm,
    closeDeleteConfirm,
    confirmDelete,
  };
}

