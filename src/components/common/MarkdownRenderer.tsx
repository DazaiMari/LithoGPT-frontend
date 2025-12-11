import ReactMarkdown from 'react-markdown';
import { ReactNode } from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  showLoadingCursor?: boolean;
}

export default function MarkdownRenderer({ 
  content, 
  className = '', 
  showLoadingCursor = false 
}: MarkdownRendererProps) {
  return (
    <div className={`prose prose-sm dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        components={{
          // 自定义段落样式
          p: ({ children }: { children?: ReactNode }) => (
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 last:mb-0">
              {children}
            </p>
          ),
          // 自定义标题样式
          h1: ({ children }: { children?: ReactNode }) => (
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mt-6 mb-4 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }: { children?: ReactNode }) => (
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mt-5 mb-3 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }: { children?: ReactNode }) => (
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-4 mb-2 first:mt-0">
              {children}
            </h3>
          ),
          // 自定义列表样式
          ul: ({ children }: { children?: ReactNode }) => (
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-1">
              {children}
            </ul>
          ),
          ol: ({ children }: { children?: ReactNode }) => (
            <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-1">
              {children}
            </ol>
          ),
          li: ({ children }: { children?: ReactNode }) => (
            <li className="text-gray-700 dark:text-gray-300">
              {children}
            </li>
          ),
          // 自定义强调样式
          strong: ({ children }: { children?: ReactNode }) => (
            <strong className="font-semibold text-gray-800 dark:text-white">
              {children}
            </strong>
          ),
          em: ({ children }: { children?: ReactNode }) => (
            <em className="italic text-gray-700 dark:text-gray-300">
              {children}
            </em>
          ),
          // 自定义代码样式
          code: ({ children, className }: { children?: ReactNode; className?: string }) => {
            const isInline = !className;
            return isInline ? (
              <code className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-sm text-gray-800 dark:text-gray-200">
                {children}
              </code>
            ) : (
              <code className={className}>{children}</code>
            );
          },
          // 自定义引用样式
          blockquote: ({ children }: { children?: ReactNode }) => (
            <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-600 dark:text-gray-400 my-4">
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
      {showLoadingCursor && (
        <span className="inline-block ml-1 animate-pulse text-gray-700 dark:text-gray-300">▌</span>
      )}
    </div>
  );
}

