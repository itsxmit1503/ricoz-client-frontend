import { SignIn } from "@clerk/nextjs";
import AuthShell from "@/components/layout/AuthShell";

export default function LoginPage() {
  return (
    <AuthShell>
      <SignIn path="/login" routing="path" signUpUrl="/sign-up"  />
    </AuthShell>
  );
}
