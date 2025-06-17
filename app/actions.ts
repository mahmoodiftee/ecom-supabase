"use server";

import { headers } from "next/headers";
import { useUser } from "@/context/UserContext";
import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabasePublic } from "@/utils/supabase/publicClient";

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  const user = data?.user;
  const { data: profileData } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()


  const userCookie = await cookies();
  userCookie.set("user", JSON.stringify(user));

  if (profileData?.role === "admin") {
    return redirect("/dashboard");
  } else if (profileData?.role === "user") {
    return redirect("/profile");
  }

};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const userCookie = await cookies();
  userCookie.delete("user");

  return redirect("/sign-in");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed"
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const phone = formData.get("phone")?.toString();
  const full_name = formData.get("full_name")?.toString();
  const avatarFile = formData.get("avatar") as File | null;

  const supabase = await createClient();
  const headersList = await headers();
  const origin = headersList.get("origin");

  // Basic validation
  if (!email || !password || !phone || !full_name) {
    return encodedRedirect("error", "/sign-up", "All fields are required");
  }

  // 1. Sign up the user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name,
        phone,
      },
    },
  });

  if (authError) {
    console.error(authError.code + " " + authError.message);
    return encodedRedirect("error", "/sign-up", authError.message);
  }

  // Wait for user to be fully created
  if (!authData.user?.id) {
    return encodedRedirect("error", "/sign-up", "User creation failed");
  }

  let avatarUrl = null;

  // 2. Upload avatar if provided
  if (avatarFile && avatarFile.size > 0) {
    try {
      const fileExt = avatarFile.name.split(".").pop();
      const fileName = `${authData.user.id}.${fileExt}`;
      const filePath = `${fileName}`;

      // First try to upload the file
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatarFile, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        console.error("Avatar Upload Error:", uploadError.message);
        // If upload fails due to bucket policy, try with public client
        const publicClient = supabasePublic;
        const { error: publicUploadError } = await publicClient.storage
          .from("avatars")
          .upload(filePath, avatarFile, {
            cacheControl: "3600",
            upsert: true,
          });

        if (publicUploadError) {
          console.error("Public Avatar Upload Error:", publicUploadError.message);
          throw publicUploadError;
        }
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      avatarUrl = urlData.publicUrl;
    } catch (error) {
      console.error("Avatar processing failed:", error);
      // Continue without avatar if upload fails
    }
  }

  // 3. Create profile record
  const { error: profileError } = await supabase.from("profiles").insert({
    id: authData.user.id,
    email,
    phone,
    full_name,
    avatar_url: avatarUrl || null,
  });

  if (profileError) {
    console.error("Full Profile Error:", {
      code: profileError.code,
      message: profileError.message,
      details: profileError.details,
      hint: profileError.hint,
      stack: profileError.stack,
    });
    return encodedRedirect(
      "error",
      "/sign-up",
      `Profile setup failed: ${profileError.message}`
    );
  }

  return encodedRedirect(
    "success",
    "/sign-up",
    "Thanks for signing up! Please check your email for a verification link."
  );
};

// app/actions.ts
export const updateProfileAction = async (formData: FormData) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const full_name = formData.get("full_name")?.toString();
  const phone = formData.get("phone")?.toString();
  const avatarFile = formData.get("avatar") as File | null;

  // Validate required fields
  if (!full_name || !phone) {
    return redirect("/profile?message=Full name and phone are required");
  }

  let avatarUrl = null;

  try {
    // Handle avatar upload if a new file was provided
    if (avatarFile && avatarFile.size > 0) {
      const fileExt = avatarFile.name.split(".").pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatarFile, {
          cacheControl: "3600",
          upsert: true,
        });

      if (!uploadError) {
        // Get public URL
        const { data: urlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        avatarUrl = urlData.publicUrl;
      } else {
        console.error("Avatar Upload Error:", uploadError.message);
      }
    }

    // Update profile
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name,
        phone,
        ...(avatarUrl !== null && { avatar_url: avatarUrl }),
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Profile update error:", updateError.message);
      return redirect("/profile?message=Failed to update profile");
    }

    return redirect("/profile");
  } catch (error) {
    console.error("Error in updateProfileAction:", error);
    return redirect("/profile");
  }
};
