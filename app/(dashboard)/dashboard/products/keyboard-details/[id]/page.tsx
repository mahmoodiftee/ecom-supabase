import { notFound } from "next/navigation";
import { supabasePublic } from "@/utils/supabase/publicClient";
import ProductDetail from "../singleKeyboard";

export default async function KeyboardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Await the params promise
  const { id } = await params;

  const { data: keyboards, error } = await supabasePublic
    .from("keyboards")
    .select("*");

  if (error) {
    console.error("Error fetching data from Supabase:", error);
    notFound();
  }

  if (!keyboards || keyboards.length === 0) {
    notFound();
  }

  console.log("Product ID from URL:", id);

  // Ensure both `id` and `product.id` are of the same type
  const product = keyboards.find((p) => String(p.id) === String(id));

  if (!product) {
    console.log("Product not found:", id);
    notFound();
  }

  return <ProductDetail product={product} />;
}