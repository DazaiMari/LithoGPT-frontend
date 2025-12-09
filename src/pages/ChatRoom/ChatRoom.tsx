import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import Button from "@/components/ui/button/Button";
import ConfirmModal from "@/components/ui/modal/ConfirmModal";
import { useUserInfoStore } from "@/store/userInfoStore";
import { useChatRoom } from "./hooks/useChatRoom";
import {
  PostCard,
  PostSkeleton,
  EmptyState,
  CreatePostModal,
  CommentsModal,
  Pagination,
} from "./components";

export default function ChatRoom() {
  const { avatarUrl } = useUserInfoStore();
  const {
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
  } = useChatRoom();

  return (
    <>
      <PageMeta
        title="Forum | LithoGPT"
        description="Share and discuss stone appreciation"
      />
      <PageBreadcrumb pageTitle="Forum" />

      {/* Header with Toggle and Create Button */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
        <p className="text-gray-500 dark:text-gray-400">
          Share your stone appreciation with the community
        </p>
          {/* Toggle Switch */}
          <label
            className="flex cursor-pointer select-none items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-400"
            onClick={togglePersonalMode}
          >
            <div className="relative">
              <div
                className={`block transition duration-150 ease-linear h-6 w-11 rounded-full ${
                  isPersonalMode
                    ? "bg-red-500"
                    : "bg-gray-200 dark:bg-white/10"
                }`}
              ></div>
              <div
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full shadow-theme-sm duration-150 ease-linear transform bg-white ${
                  isPersonalMode ? "translate-x-full" : "translate-x-0"
                }`}
              ></div>
            </div>
            <span className="whitespace-nowrap">
              {isPersonalMode ? "My Posts" : "All Posts"}
            </span>
          </label>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Post
        </Button>
      </div>

      {/* Loading Skeleton */}
      {loading && <PostSkeleton />}

      {/* Empty State */}
      {!loading && posts.length === 0 && <EmptyState />}

      {/* Post List */}
      {!loading && posts.length > 0 && (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLikePost}
              onComment={handleOpenComments}
              onDelete={handleDeletePost}
              canDelete={isPersonalMode}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={fetchPosts}
      />

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={newPostTitle}
        setTitle={setNewPostTitle}
        content={newPostContent}
        setContent={setNewPostContent}
        images={newPostImages}
        uploadingImage={uploadingImage}
        submitting={submitting}
        imageInputRef={imageInputRef}
        onImageUpload={handleImageUpload}
        onRemoveImage={handleRemoveImage}
        onSubmit={handleCreatePost}
      />

      {/* Comments Modal */}
      <CommentsModal
        isOpen={isCommentModalOpen}
        onClose={handleCloseComments}
        post={selectedPost}
        comments={comments}
        loadingComments={loadingComments}
        newComment={newComment}
        setNewComment={setNewComment}
        submittingComment={submittingComment}
        userAvatar={avatarUrl}
        onSubmitComment={handleCreateComment}
        onLikeComment={handleLikeComment}
        onDeleteComment={handleDeleteComment}
        canDeleteComment={isPersonalMode}
      />

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={closeDeleteConfirm}
        onConfirm={confirmDelete}
        title={deleteConfirm.type === "post" ? "Delete Post" : "Delete Comment"}
        message={
          deleteConfirm.type === "post"
            ? "Are you sure you want to delete this post? This action cannot be undone."
            : "Are you sure you want to delete this comment? This action cannot be undone."
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  );
}
