import ProductGrid from "@/components/product-grid";
import ProductFilters from "@/components/product-filters";
import { Toaster } from "@/components/ui/toaster";
import { Products, SearchParams } from "@/types/products";
import { supabasePublic } from "@/utils/supabase/publicClient";

export default async function KeyboardsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // Await the searchParams promise
  const params = await searchParams;

  const { data } = await supabasePublic
    .schema('public')
    .from('keyboards')
    .select('*');

  const keyboards = (data ?? []) as Products[];

  const query = params.q || "";
  const minPrice = Number(params.minPrice) || 0;
  const maxPrice = Number(params.maxPrice) || 20000;
  const categories = params.categories?.split(",") || [];
  const brands = params.brands?.split(",") || [];
  const inStock = params.inStock === "true";

  const AllBrands: string[] = [];
  keyboards.forEach((keyboard) => {
    if (!AllBrands.includes(keyboard.brand)) {
      AllBrands.push(keyboard.brand);
    }
  });

  let filteredProducts = [...keyboards];

  // Filters
  if (query) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  filteredProducts = filteredProducts.filter(
    (product) => product.price >= minPrice && product.price <= maxPrice
  );

  if (categories.length > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      categories.includes(product.category)
    );
  }

  if (brands.length > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      brands.includes(product.brand)
    );
  }

  if (inStock) {
    filteredProducts = filteredProducts.filter(
      (product) => product.quantity > 0
    );
  }

  const reversedProducts = [...filteredProducts].reverse();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Keyboards ({filteredProducts.length})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <ProductFilters brands={AllBrands} maxPrice={20000} />
        </div>

        <div className="lg:col-span-3">
          <ProductGrid products={reversedProducts} />
        </div>
      </div>

      <Toaster />
    </div>
  );
}