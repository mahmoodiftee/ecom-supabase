import { notFound } from "next/navigation";
import ProductDetail from "@/components/product-detail";
import { supabasePublic } from "@/utils/supabase/publicClient";

export default async function KeyboardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Await the params promise
  const { id } = await params;

  const { data: product, error } = await supabasePublic
    .from("keyboards")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching product from Supabase:", error);
    notFound();
  }

  if (!product) {
    console.log("Product not found:", id);
    notFound();
  }

  return <ProductDetail product={product} />;
}