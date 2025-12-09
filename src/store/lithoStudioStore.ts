import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface LithoStudioState {
  // 状态
  assistantText: string;
  requestImageUrl: string;
  requestImageUrls: string[];
  requestPrompt: string;
  requestOptions: string;
  requestOptionsValues: string[]; // 选中的 option values
  loading: boolean;

  // Actions
  setAssistantText: (text: string) => void;
  appendAssistantText: (text: string) => void;
  setRequestImageUrl: (url: string) => void;
  setRequestImageUrls: (urls: string[]) => void;
  setRequestPrompt: (prompt: string) => void;
  setRequestOptions: (options: string, values: string[]) => void;
  setLoading: (loading: boolean) => void;
  resetAll: () => void;
}

export const useLithoStudioStore = create<LithoStudioState>()(
  persist(
    (set) => ({
      // 初始状态
      assistantText: "",
      requestImageUrl: "",
      requestImageUrls: [],
      requestPrompt: "",
      requestOptions: "",
      requestOptionsValues: [],
      loading: false,

      // Actions
      setAssistantText: (text) => set({ assistantText: text }),
      appendAssistantText: (text) =>
        set((state) => ({ assistantText: state.assistantText + text })),
      setRequestImageUrl: (url) => set({ requestImageUrl: url }),
      setRequestImageUrls: (urls) => set({ requestImageUrls: urls }),
      setRequestPrompt: (prompt) => set({ requestPrompt: prompt }),
      setRequestOptions: (options, values) => set({ requestOptions: options, requestOptionsValues: values }),
      setLoading: (loading) => set({ loading }),
      resetAll: () =>
        set({
          assistantText: "",
          requestImageUrl: "",
          requestImageUrls: [],
          requestPrompt: "",
          requestOptions: "",
          requestOptionsValues: [],
          loading: false,
        }),
    }),
    {
      name: "litho-studio-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        // 只持久化这些字段（不持久化 loading）
        assistantText: state.assistantText,
        requestImageUrl: state.requestImageUrl,
        requestImageUrls: state.requestImageUrls,
        requestPrompt: state.requestPrompt,
        requestOptions: state.requestOptions,
        requestOptionsValues: state.requestOptionsValues,
      }),
    }
  )
);

