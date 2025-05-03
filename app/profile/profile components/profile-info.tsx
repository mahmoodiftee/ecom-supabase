"use client";

import { useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera } from "lucide-react";
import { SignOut } from "@/components/singOut";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { supabasePublic } from "@/utils/supabase/publicClient";

interface ProfileInfoProps {
  profile: any;
  user: any;
  searchParams: any;
}

export default function ProfileInfo({
  profile,
  user,
  searchParams,
}: ProfileInfoProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    profile?.avatar_url || null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type?: string; content?: string }>(
    searchParams.message ? { type: "error", content: searchParams.message } : {}
  );
  const router = useRouter();

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({});

    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const full_name = formData.get("full_name")?.toString();
      const phone = formData.get("phone")?.toString();
      const address = formData.get("address")?.toString();

      // Debug logging
      console.log("Updating profile for user:", user?.id);
      console.log("Form data:", { full_name, phone, address });
      console.log("Selected file:", selectedFile ? selectedFile.name : "none");

      if (!full_name || !phone) {
        throw new Error("Full name and phone are required");
      }

      if (!user) {
        router.push("/sign-in");
        return;
      }

      let avatarUrl = profile?.avatar_url || null;

      // Handle avatar upload if a new file was selected
      if (selectedFile) {
        console.log("Starting file upload...");
        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `${user.id}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, selectedFile, {
            cacheControl: "3600",
            upsert: true,
          });

        if (uploadError) {
          console.error("Upload error details:", uploadError);
          throw new Error("Failed to upload avatar");
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        avatarUrl = urlData.publicUrl;
        console.log("New avatar URL:", avatarUrl);
      }

      // Update profile - use the authenticated client
      console.log("Updating profile data...");
      const { data, error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name,
          phone,
          address,
          ...(avatarUrl !== null && { avatar_url: avatarUrl }),
        })
        .eq("id", user.id)
        .select();

      console.log("Update result:", { data, error: updateError });

      if (updateError) {
        console.error("Update error details:", updateError);
        throw new Error("Failed to update profile");
      }

      // Verify the update
      if (data && data.length > 0) {
        console.log("Verified update:", data[0]);
        setMessage({ type: "success", content: "Profile updated successfully!" });
        router.refresh();
      } else {
        throw new Error("Update didn't return any data");
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Update failed";
      console.error("Full error:", error);
      setMessage({
        type: "error",
        content: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your profile details</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center gap-4 mb-3">
            <div className="relative group" onClick={handleImageClick}>
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Profile preview"
                  className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-2xl font-bold">
                  {profile?.full_name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="h-6 w-6 text-white" />
              </div>
            </div>
            <Input
              type="file"
              id="avatar"
              name="avatar"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              ref={fileInputRef}
            />
            <Label
              htmlFor="avatar"
              className="text-sm text-gray-500 cursor-pointer"
            >
              Change profile picture
            </Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                defaultValue={user.email || ""}
                disabled
              />
              <p className="text-xs">Your email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                name="full_name"
                defaultValue={profile?.full_name || ""}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={profile?.phone || ""}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                defaultValue={profile?.address || ""}
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? "Updating..." : "Update Profile"}
          </Button>
          <SignOut />
          <div className="flex flex-col gap-2 w-full max-w-md text-sm">
            {message.type === "success" && (
              <div className="text-foreground border-l-2 border-foreground px-4">
                {message.content}
              </div>
            )}
            {message.type === "error" && (
              <div className="text-destructive-foreground border-l-2 border-destructive-foreground px-4">
                {message.content}
              </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}