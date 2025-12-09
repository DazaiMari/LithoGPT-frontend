interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        Previous
      </button>
      <span className="px-4 py-2 text-gray-600 dark:text-gray-300">
        {currentPage} / {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        Next
      </button>
    </div>
  );
}

