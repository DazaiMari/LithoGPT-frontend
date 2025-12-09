export default function PostSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="space-y-2">
              <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-3 w-16 rounded bg-gray-100 dark:bg-gray-800"></div>
            </div>
          </div>
          <div className="h-5 w-2/3 rounded bg-gray-200 dark:bg-gray-700 mb-3"></div>
          <div className="h-4 w-full rounded bg-gray-100 dark:bg-gray-800"></div>
        </div>
      ))}
    </div>
  );
}

