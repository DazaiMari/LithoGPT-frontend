export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-4 rounded-full bg-gray-100 p-6 dark:bg-gray-800">
        <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No posts yet</h3>
      <p className="mt-1 text-sm text-gray-500">Be the first to share something!</p>
    </div>
  );
}

