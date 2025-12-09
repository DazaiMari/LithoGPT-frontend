import { http, httpStream } from './http.ts'

export const stoneUpload = (data: FormData) => http.post("/stone/upload", data)

export const stoneChat = (data: {
    conversationId?: number | null,
    stoneImageUrls?: string[],
    prompt?: string
}) => http.post("/stone/chat", data)

// SSE 流式聊天接口（使用 httpStream，无响应拦截器干扰）
export const stoneChatStream = async (
    data: {
        conversationId?: number | null,
        stoneImageUrls?: string[],
        prompt?: string
    },
    onMessage: (content: string) => void,
    onDone: () => void,
    onError: (error: Error) => void
) => {
    let processedLength = 0;

    try {
        await httpStream.post("/stone/chat", data, {
            responseType: 'text',
            onDownloadProgress: (progressEvent) => {
                const responseText = progressEvent.event?.target?.responseText || '';
                const newData = responseText.slice(processedLength);
                processedLength = responseText.length;

                if (!newData) return;

                const lines = newData.split('\n');
                for (const line of lines) {
                    if (line.startsWith('data:')) {
                        try {
                            const jsonStr = line.slice(5);
                            if (jsonStr.trim()) {
                                const json = JSON.parse(jsonStr);
                                // 新格式: {"type":"content","content":"xxx","error":null,"done":false}
                                if (json?.type === 'content' && json?.content) {
                                    onMessage(json.content);
                                }
                                // 检查是否有错误
                                if (json?.error) {
                                    onError(new Error(json.error));
                                    return;
                                }
                            }
                        } catch {
                            // JSON 解析失败，忽略
                        }
                    }
                }
            }
        });
        onDone();
    } catch (error) {
        onError(error as Error);
    }
};

export const stoneHistory = () => http.get("/stone/history")

export const stoneMessage = (data: {
    conversationId: string
}) => http.get("/stone/conversation/messages", { params: data ,timeout: 50000})
