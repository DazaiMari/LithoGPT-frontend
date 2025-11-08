import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUp() {
  return (
    <>
    <PageMeta
      title="LithoGPT | AI Stone Appreciation & Cultural Intelligence Platform"
      description="Sign in to LithoGPT — an AI-powered platform for intelligent stone appreciation, cultural aesthetics, and creative dialogue."
    />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
