import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import ForgetPwdForm from "../../components/auth/ResetPwdForm.tsx";

export default function ResetPwd() {
  return (
    <>
    <PageMeta
      title="LithoGPT | AI Stone Appreciation & Cultural Intelligence Platform"
      description="Sign up to LithoGPT — an AI-powered platform for intelligent stone appreciation, cultural aesthetics, and creative dialogue."
    />
      <AuthLayout>
        <ForgetPwdForm />
      </AuthLayout>
    </>
  );
}
