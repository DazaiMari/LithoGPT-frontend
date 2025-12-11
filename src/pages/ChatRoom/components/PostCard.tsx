import Avatar from "@/components/ui/avatar/Avatar";
import MarkdownRenderer from "@/components/common/MarkdownRenderer";
import type { Post } from "../types";
import { DEFAULT_AVATAR } from "../constants";
import { formatTime } from "../utils";

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (post: Post) => void;
  onDelete: (postId: string) => void;
  canDelete?: boolean;
}

export default function PostCard({ post, onLike, onComment, onDelete, canDelete = false }: PostCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden transition-shadow hover:shadow-lg">
      {/* Post Header */}
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar
            src={post.userAvatar || DEFAULT_AVATAR}
            alt={post.userName}
            size="large"
          />
          <div>
            <h4 className="font-medium text-gray-800 dark:text-white/90">
              {post.userName}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatTime(post.createTime)}
            </p>
          </div>
        </div>
        {canDelete && (
        <button
          onClick={() => onDelete(post.id)}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          title="Delete post"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
        )}
      </div>

      {/* Post Content */}
      <div className="px-6 pb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">
          {post.title}
        </h3>
        <MarkdownRenderer 
          content={post.content}
          className="text-gray-600 dark:text-gray-300"
        />
      </div>

      {/* Post Images */}
      {post.imageUrls && post.imageUrls.length > 0 && (
        <div className="px-6 pb-4">
          <div className="flex flex-wrap gap-3">
            {post.imageUrls.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Post image ${idx + 1}`}
                className={`rounded-xl cursor-pointer hover:opacity-90 transition-opacity ${
                  post.imageUrls.length === 1
                    ? 'max-w-full max-h-[400px] object-contain'
                    : 'max-w-[calc(50%-6px)] max-h-[200px] object-cover'
                }`}
                onClick={() => window.open(img, '_blank')}
              />
            ))}
          </div>
        </div>
      )}

      {/* Post Actions */}
      <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-800 flex items-center gap-6">
        <button
          onClick={() => onLike(post.id)}
          className={`flex items-center gap-2 transition-colors ${
            post.isLiked
              ? 'text-red-500'
              : 'text-gray-500 hover:text-red-500 dark:text-gray-400'
          }`}
        >
          <svg className="w-5 h-5" fill={post.isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span className="text-sm font-medium">{post.likeCount}</span>
        </button>

        <button
          onClick={() => onComment(post)}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="text-sm font-medium">{post.commentCount}</span>
        </button>
      </div>
    </div>
  );
}

