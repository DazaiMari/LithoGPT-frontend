import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import DropzoneComponent from "../../components/form/form-elements/DropZone";
import SelectInputs from "../../components/form/form-elements/SelectInputs";
import TextAreaInput from "../../components/form/form-elements/TextAreaInput";
import Button from "../../components/ui/button/Button.tsx";
import {stoneChatStream} from "@/api/stone";
import { useLithoStudioStore } from "@/store/lithoStudioStore";

export default function LithoStudio() {
    // 使用 store 管理状态（路由切换后保持）
    const {
        loading,
        assistantText,
        requestImageUrl,
        requestImageUrls,
        requestPrompt,
        requestOptions,
        requestOptionsValues,
        setLoading,
        setAssistantText,
        appendAssistantText,
        setRequestImageUrl,
        setRequestImageUrls,
        setRequestPrompt,
        setRequestOptions,
    } = useLithoStudioStore();

    const handleImageUploadSuccess = (url: string) => {
        setRequestImageUrl(url);
        setRequestImageUrls(url ? [url] : []);
    };

    const handleTextChange = (text: string) => {
        setRequestPrompt(text);
    };

    const handleOptionChange = (options: string, values: string[]) => {
        setRequestOptions(options, values);
    };

    const combinedPrompt = `This is my personalised requirement：${requestPrompt},Please generate the article in the
     following style:${requestOptions}`;

    const handleChat = async () => {
        setLoading(true);
        setAssistantText(""); // 清空之前的内容

        await stoneChatStream(
            {
                conversationId: null,
                stoneImageUrls: requestImageUrls,
                prompt: combinedPrompt,
            },
            // onMessage: 每次收到新内容时累加
            (content) => {
                appendAssistantText(content);
            },
            // onDone: 完成时
            () => {
                setLoading(false);
            },
            // onError: 出错时
            (error) => {
                console.error("Stream error:", error);
                setLoading(false);
            }
        );
    };

    return (
    <div>
      <PageMeta
       title="LithoGPT – Upload Stone Images & Generate AI Insights"
       description="Upload your stone images and let LithoGPT reveal their natural beauty, structure, and meaning. Experience AI-powered stone appreciation combining art, geology, and Eastern aesthetics."
      />
      <PageBreadcrumb pageTitle="LithoStudio" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[630px] text-center space-y-6">
          <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            Begin AI appreciation
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
            Please upload a clear photo of your stone.
            Try to capture its natural shape, texture, and color under soft light.
            The AI will analyze the image and generate an interpretation for you.
          </p>
          <DropzoneComponent 
            onUploadSuccess={handleImageUploadSuccess} 
            initialImageUrl={requestImageUrl}
          />
          {/* {requestImageUrl && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              已上传：{requestImageUrl}
            </p>
          )} */}
          <TextAreaInput 
            onTextChange={handleTextChange} 
            initialValue={requestPrompt}
          />
          {/* {requestPrompt && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              描述：{requestPrompt}
            </p>
          )} */}
          <SelectInputs 
            onTextChange={handleOptionChange} 
            initialValues={requestOptionsValues}
          />
          {/* {requestOptions && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              描述：{requestOptions}
            </p>
          )} */}
            <Button size="sm" variant="primary" onClick={handleChat} disabled={loading}>
              {loading ? "Generating..." : "Generate Your Artistic Stone Interpretation"}
            </Button>

            {/* AI 生成结果显示区域 */}
            {(assistantText || loading) && (
              <div className="mt-6 p-6 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-left">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  AI Interpretation
                </h4>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {assistantText ? (
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {assistantText}
                      {loading && <span className="animate-pulse">▌</span>}
                    </p>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-500">
                      <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                      <span>Thinking...</span>
                    </div>
                  )}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}


