import { notFound } from "next/navigation";
import ProductDetail from "@/components/product-detail";
import { createClient } from "@/utils/supabase/server";

export default async function KeyboardsPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const { data: keyboards, error } = await supabase
    .from("keyboards")
    .select("*"); // Retrieve all columns

  if (error) {
    console.error("Error fetching data from Supabase:", error);
    notFound();
  }

  if (!keyboards || keyboards.length === 0) {
    notFound();
  }

  const { id } = params;
  console.log("Product ID from URL:", id);

  // Ensure both `id` and `product.id` are of the same type
  const product = keyboards.find((p) => String(p.id) === String(id));

  if (!product) {
    console.log("Product not found:", id);
    notFound();
  }

  return <ProductDetail product={product} />;
}
