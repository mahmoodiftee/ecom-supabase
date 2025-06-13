"use client";
import { signInAction } from "@/app/actions";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
export function ClientSignInForm() {
  const { setUser } = useUser();
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });

    if (error) {
      return;
    }

    if (data?.user) {
      setUser(data.user);
      router.push("/profile");
      router.refresh();
    }
  };

  return (
    <form className="flex-1 flex flex-col min-w-64" action={handleSubmit}>
      <h1 className="text-2xl font-medium">Sign in</h1>
      <p className="text-sm text-foreground">
        Don't have an account?{" "}
        <Link className="text-foreground font-medium underline" href="/sign-up">
          Sign up
        </Link>
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="email">Email</Label>
        <Input name="email" placeholder="you@example.com" required />
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Password</Label>
          <Link
            className="text-xs text-foreground underline"
            href="/forgot-password"
          >
            Forgot Password?
          </Link>
        </div>
        <Input
          type="password"
          name="password"
          placeholder="Your password"
          required
        />
        <SubmitButton pendingText="Signing In..." formAction={signInAction}>
          Sign in
        </SubmitButton>
      </div>
    </form>
  );
}