import { SignUp } from "@clerk/nextjs";
import AuthShell from "@/components/layout/AuthShell";

export default function SignUpPage() {
  return (
    <AuthShell>
      <SignUp path="/sign-up" routing="path" signInUrl="/login"  />
    </AuthShell>
  );
}
