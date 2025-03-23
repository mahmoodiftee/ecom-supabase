import ProductGrid from "@/components/product-grid";
import ProductFilters from "@/components/product-filters";
import { Toaster } from "@/components/ui/toaster";
import { createClient } from "@/utils/supabase/server";
import { Products, SearchParams } from "@/types/products";

export default async function KeyboardsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = await createClient();
  const { data: keyboards } = await supabase
    .from("keyboards")
    .select<"keyboards", Products>();
  console.log(keyboards);
  const query = (await searchParams).q || "";
  const minPrice = Number((await searchParams).minPrice) || 0;
  const maxPrice = Number((await searchParams).maxPrice) || 20000;
  const categories = (await searchParams).categories?.split(",") || [];
  const brands = (await searchParams).brands?.split(",") || [];
  const inStock = (await searchParams).inStock === "true";
  const AllBrands: string[] = [];

  keyboards?.forEach((keyboard) => {
    if (!AllBrands.includes(keyboard.brand)) {
      AllBrands.push(keyboard.brand);
    }
  });

  let filteredProducts = keyboards ? [...keyboards] : [];

  // Apply search query filter
  if (query) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Apply price filter
  filteredProducts = filteredProducts.filter(
    (product) => product.price >= minPrice && product.price <= maxPrice
  );

  // Apply category filter
  if (categories.length > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      categories.includes(product.category)
    );
  }

  // Apply brand filter
  if (brands.length > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      brands.includes(product.brand)
    );
  }

  // Apply in-stock filter
  if (inStock) {
    filteredProducts = filteredProducts.filter(
      (product) => product.quantity > 0
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <h1 className="text-3xl font-bold mb-8">
        Keyboards
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <ProductFilters brands={AllBrands} maxPrice={20000} />
        </div>

        <div className="lg:col-span-3">
          <ProductGrid products={filteredProducts} />
        </div>
      </div>
      <Toaster />
    </div>
  );
}
