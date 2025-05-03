"use client";

import { LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { signOutAction } from "@/app/actions";
import { useUser } from "@/context/UserContext";
export function SignOut() {
  const { setUser } = useUser();
  const handleLogout = () => {
    signOutAction();
    setUser(null);
  };
  return (
    <Button
      onClick={handleLogout}
      className="w-full flex justify-center items-center gap-2"
      variant={"default"}
    >
      Logout <LogOut className="size-3" />
    </Button>
  );
}
