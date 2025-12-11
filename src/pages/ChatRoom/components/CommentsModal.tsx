import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import TextArea from "@/components/form/input/TextArea";
import Avatar from "@/components/ui/avatar/Avatar";
import MarkdownRenderer from "@/components/common/MarkdownRenderer";
import type { Post, Comment } from "../types";
import { DEFAULT_AVATAR } from "../constants";
import { formatTime } from "../utils";

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
  comments: Comment[];
  loadingComments: boolean;
  newComment: string;
  setNewComment: (value: string) => void;
  submittingComment: boolean;
  userAvatar: string | null;
  onSubmitComment: () => void;
  onLikeComment: (commentId: string) => void;
  onDeleteComment?: (commentId: string) => void;
  canDeleteComment?: boolean;
}

export default function CommentsModal({
  isOpen,
  onClose,
  post,
  comments,
  loadingComments,
  newComment,
  setNewComment,
  submittingComment,
  userAvatar,
  onSubmitComment,
  onLikeComment,
  onDeleteComment,
  canDeleteComment = false,
}: CommentsModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-2xl p-6 max-h-[80vh] overflow-hidden flex flex-col"
    >
      {post && (
        <>
          {/* Post Preview */}
          <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <Avatar
                src={post.userAvatar || DEFAULT_AVATAR}
                alt={post.userName}
                size="medium"
              />
              <div>
                <h4 className="font-medium text-gray-800 dark:text-white/90">
                  {post.userName}
                </h4>
                <p className="text-xs text-gray-500">
                  {formatTime(post.createTime)}
                </p>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              {post.title}
            </h3>
          </div>

          {/* Comment Input */}
          <div className="mb-4 flex gap-3">
            <Avatar src={userAvatar || DEFAULT_AVATAR} size="medium" />
            <div className="flex-1">
              <TextArea
                value={newComment}
                onChange={setNewComment}
                placeholder="Write a comment..."
                rows={2}
              />
              <div className="mt-2 flex justify-end">
                <Button
                  size="sm"
                  onClick={onSubmitComment}
                  disabled={!newComment.trim() || submittingComment}
                >
                  {submittingComment ? "Posting..." : "Comment"}
                </Button>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto space-y-4">
            {loadingComments ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No comments yet. Be the first to comment!
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar
                    src={comment.userAvatar || DEFAULT_AVATAR}
                    alt={comment.userName}
                    size="medium"
                  />
                  <div className="flex-1">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3">
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="font-medium text-gray-800 dark:text-white/90 text-sm">
                          {comment.userName}
                        </h5>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {formatTime(comment.createTime)}
                          </span>
                          {canDeleteComment && onDeleteComment && (
                            <button
                              onClick={() => onDeleteComment(comment.id)}
                              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                              title="Delete comment"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                      <MarkdownRenderer 
                        content={comment.content}
                        className="text-sm text-gray-600 dark:text-gray-300"
                      />
                    </div>
                    <div className="flex items-center gap-4 mt-2 ml-2">
                      <button
                        onClick={() => onLikeComment(comment.id)}
                        className={`flex items-center gap-1 text-xs transition-colors ${
                          comment.isLiked
                            ? 'text-red-500'
                            : 'text-gray-500 hover:text-red-500'
                        }`}
                      >
                        <svg className="w-4 h-4" fill={comment.isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {comment.likeCount}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </Modal>
  );
}

