"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogInIcon, User } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

export default function HeaderAuth() {
  const { user } = useUser();
  const router = useRouter();

  const handleSignInRedirect = () => {
    router.push("/sign-in");
  };

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <Link href="/profile">
          <Button variant="ghost" size="sm" asChild>
            <div className="flex items-center gap-1">
              <User className="h-6 w-6" />
            </div>
          </Button>
        </Link>
      ) : (
        
        <Button
          onClick={handleSignInRedirect}
          variant="ghost"
          size="icon"
          aria-label="Sign In"
        >
          <LogInIcon className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
