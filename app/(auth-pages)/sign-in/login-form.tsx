"use client";
import { signInAction } from "@/app/actions";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
export function ClientSignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    const { data: profileData } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    // console.log(profileData?.role);
    if (profileData) {
      setUser(data.user);
      profileData?.role === "admin"
        ? router.push("/admin")
        : router.push("/home");
      router.refresh();
    }
  };


  return (
    <form className="flex-1 flex flex-col min-w-64 md:min-w-[400px]" action={handleSubmit}>
      <h1 className="text-2xl font-medium">Sign in</h1>
      <p className="text-sm text-foreground">
        Don't have an account?{" "}
        <Link className="text-foreground font-medium underline" href="/sign-up">
          Sign up
        </Link>
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <div className="flex flex-col">
          <div className="mb-2">Tap on the credentials below for exploring</div>
          <div className="flex flex-col md:flex-row gap-2 [&>input]:mb-3">
            <Button
              className="w-full flex justify-between items-center gap-2"
              variant={"outline"}
              onClick={(e) => {
                e.preventDefault();
                setEmail("mahmoodiftee@gmail.com");
                setPassword("123456");
              }}
            >
              User
            </Button>

            <Button
              className="w-full flex justify-between items-center gap-2"
              variant={"outline"}
              onClick={(e) => {
                e.preventDefault();
                setEmail("iftee7264@gmail.com");
                setPassword("123456");
              }}
            >
              Admin
            </Button>

          </div>
        </div>
        <Label htmlFor="email">Email</Label>
        <Input name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Password</Label>
          <Link
            className="text-xs text-foreground underline"
            href="/forgot-password"
          >
            Forgot Password?
          </Link>
        </div>
        <Input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" required />
        <SubmitButton pendingText="Signing In..." formAction={signInAction}>
          Sign in
        </SubmitButton>
      </div>
    </form>
  );
}