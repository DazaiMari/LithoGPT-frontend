import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import DropzoneComponent from "../../components/form/form-elements/DropZone";
import SelectInputs from "../../components/form/form-elements/SelectInputs";
import TextAreaInput from "../../components/form/form-elements/TextAreaInput";
import Button from "../../components/ui/button/Button.tsx";

export default function LithoStudio() {
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
          <DropzoneComponent />
          <TextAreaInput />
          <SelectInputs />
            <Button size="sm" variant="primary">
              Generate Your Artistic Stone Interpretation
            </Button>
        </div>
      </div>
    </div>
  );
}


