"use client";
import { Button } from "@/components/ui/button";
import {  User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HeaderAuth() {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.push("/profile")}
      variant="ghost"
      size="icon"
      aria-label="Search"
    >
      <User className="h-6 w-6" />
    </Button>
  );
}
