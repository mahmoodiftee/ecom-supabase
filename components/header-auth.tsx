"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogInIcon, User } from "lucide-react";

export default function HeaderAuth() {

  return (
    <div className="flex items-center gap-4">

      <Link href="/profile">
        <Button variant="ghost" size="sm" asChild>
          <div className="flex items-center gap-1">
            <User className="h-6 w-6" />
          </div>
        </Button>
      </Link>

    </div>
  );
}
