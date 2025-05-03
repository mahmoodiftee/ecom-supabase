import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";
import { supabasePublic } from "./supabase/publicClient";

export async function getUserProfile(userId: string) {
  const { data, error } = await supabasePublic
    .schema('public')
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data;
}

