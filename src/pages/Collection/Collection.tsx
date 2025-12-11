import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import MarkdownRenderer from "../../components/common/MarkdownRenderer";
import Button from "@/components/ui/button/Button";
import { useEffect, useState } from "react";
import { stoneHistory, stoneMessage } from "@/api/stone.ts";
import { forumCreatePost } from "@/api/lithoForum";
import { toast } from "@/utils/message";

interface HistoryItem {
  conversationId: string;
  titles: string;
}

// 加载动画组件
function LoadingSpinner({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
      <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-sm">{text}</span>
    </div>
  );
}

// 空状态组件
function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center py-8">
      <span className="text-gray-400 dark:text-gray-500">{text}</span>
    </div>
  );
}

// 获取显示用的图片URL（取第一张）
function getDisplayImageUrl(imageUrls: string | string[]): string {
  if (Array.isArray(imageUrls)) {
    return imageUrls[0] || "";
  }
  return imageUrls || "";
}

// 收藏卡片组件
function CollectionCard({
  item,
  isSelected,
  imageUrls,
  content,
  loadingContent,
  onToggle,
  onShare,
  sharing,
}: {
  item: HistoryItem;
  isSelected: boolean;
  imageUrls: string | string[];
  content: string;
  loadingContent: boolean;
  onToggle: () => void;
  onShare: () => void;
  sharing: boolean;
}) {
  const displayImageUrl = getDisplayImageUrl(imageUrls);
  return (
    <div
      id={`card-${item.conversationId}`}
      className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] scroll-mt-24 overflow-hidden transition-shadow hover:shadow-lg"
    >
      {/* Card Header */}
      <div className="px-6 py-5 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90 truncate">
            {item.titles}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {/* Share Button - 只在展开且有内容时显示 */}
          {isSelected && !loadingContent && (displayImageUrl || content) && (
            <Button
              variant="outline"
              size="sm"
              onClick={onShare}
              disabled={sharing}
              startIcon={
                sharing ? (
                  <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                )
              }
            >
              {sharing ? "Sharing..." : "Share"}
            </Button>
          )}
          <Button
            variant={isSelected ? "primary" : "outline"}
            size="sm"
            onClick={onToggle}
            startIcon={
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${isSelected ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            }
          >
            {isSelected ? "Collapse" : "View"}
          </Button>
        </div>
      </div>

      {/* Card Body - 展开内容 */}
      {isSelected && (
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6 animate-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* 左侧图片 */}
            <div className="relative min-h-[200px] rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800/50">
              {loadingContent ? (
                <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm">
                  <LoadingSpinner text="Loading image..." />
                </div>
              ) : displayImageUrl ? (
                <img
                  src={displayImageUrl}
                  alt="Stone"
                  className="w-full h-auto rounded-xl border border-gray-200 dark:border-gray-700 hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
                  onClick={() => window.open(displayImageUrl, "_blank")}
                />
              ) : (
                <EmptyState text="No image available" />
              )}
            </div>

            {/* 右侧内容文本 */}
            <div className="flex flex-col">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                AI Analysis
              </h4>
              <div className="flex-1 rounded-xl bg-gray-50 dark:bg-gray-800/50 p-4 overflow-y-auto max-h-[400px]">
                {loadingContent ? (
                  <LoadingSpinner text="Loading analysis..." />
                ) : content ? (
                  <MarkdownRenderer 
                    content={content}
                    className="text-sm"
                  />
                ) : (
                  <EmptyState text="No content available" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Collection() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getHistory = async () => {
      try {
        setLoading(true);
        const res = await stoneHistory();
        if (Array.isArray(res.data)) {
          setHistory(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setLoading(false);
      }
    };
    getHistory();
  }, []);

  const [imageUrls, setImageurls] = useState<string | string[]>("");
  const [content, setContent] = useState<string>("");
  const [loadingContent, setLoadingContent] = useState(false);
  const [selected, setSelected] = useState<string>("");
  const [sharing, setSharing] = useState(false);

  const getConversationMessage = async (conversationId: string) => {
    try {
      setLoadingContent(true);
      setImageurls("");
      setContent("");
      const res = await stoneMessage({ conversationId });
      let contentTT = "";
      let imageUrlsTT: string | string[] = "";
      if (res.data[0]) {
        try {
          imageUrlsTT = JSON.parse(res.data[0].imageUrls);
        } catch {
          console.warn("imageUrls JSON parse error");
        }
      }
      if (res.data[1]) {
        contentTT = res.data[1].content;
      }
      setImageurls(imageUrlsTT);
      setContent(contentTT);
    } catch (error) {
      console.error("Failed to fetch message:", error);
    } finally {
      setLoadingContent(false);
    }
  };

  const handleToggleCard = (conversationId: string) => {
    if (selected === conversationId) {
      setSelected("");
      return;
    }
    getConversationMessage(conversationId);
    setSelected(conversationId);

    setTimeout(() => {
      const cardElement = document.getElementById(`card-${conversationId}`);
      if (cardElement) {
        cardElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  // 分享到论坛
  const handleShare = async (title: string) => {
    if (!imageUrls && !content) {
      toast.error("No content to share");
      return;
    }

    // 处理 imageUrls，确保是字符串数组
    let imageUrlsArray: string[] = [];
    if (imageUrls) {
      if (Array.isArray(imageUrls)) {
        // 如果已经是数组，直接使用
        imageUrlsArray = imageUrls;
      } else if (typeof imageUrls === "string") {
        // 如果是字符串，包装成数组
        imageUrlsArray = [imageUrls];
      }
    }

    try {
      setSharing(true);
      await forumCreatePost({
        title: title || "Stone Appreciation",
        content: content || "",
        imageUrls: imageUrlsArray,
      });
      toast.success("Shared to ChatRoom successfully!");
    } catch (error) {
      console.error("Failed to share:", error);
      toast.error("Failed to share to ChatRoom");
    } finally {
      setSharing(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Collection | LithoGPT"
        description="View your stone appreciation collection"
      />
      <PageBreadcrumb pageTitle="Collection" />

      {/* Header */}
      <div className="mb-6">
        <p className="text-gray-500 dark:text-gray-400">
          View and manage your stone appreciation history
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Loading your collection...</span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && history.length === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-2">
            No collections yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Start appreciating stones to build your collection!
          </p>
        </div>
      )}

      {/* Collection List */}
      {!loading && history.length > 0 && (
        <div className="space-y-5 sm:space-y-6">
          {history.map((item) => (
            <CollectionCard
              key={item.conversationId}
              item={item}
              isSelected={selected === item.conversationId}
              imageUrls={imageUrls}
              content={content}
              loadingContent={loadingContent}
              onToggle={() => handleToggleCard(item.conversationId)}
              onShare={() => handleShare(item.titles)}
              sharing={sharing}
            />
          ))}
        </div>
      )}
    </>
  );
}
