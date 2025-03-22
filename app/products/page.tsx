import ProductGrid from "@/components/product-grid";
import ProductFilters from "@/components/product-filters";
import { Toaster } from "@/components/ui/toaster";
import { createClient } from "@/utils/supabase/server";
// Information type
type ProductFeature = {
  feature: string;
  value: string;
};

// Review type
type Review = {
  user_id: string;
  user_name: string;
  user_image: string;
  stars: number;
  description: string;
};

// Specifications type
type GeneralSpecs = {
  model: string;
  layout: string;
  color: string;
  keyboard_shell: string;
  surface_finish: string;
  weight: string;
};

type SwitchTypingExperience = {
  switch_type: string;
  mounting_structure: string;
  hot_swappable: string;
  n_key_rollover: string;
};

type PlatePCB = {
  plate_material: string;
  pcb: string;
  quick_disassemble: string;
};

type Keycaps = {
  profile: string;
  material: string;
};

type ConnectivityCompatibility = {
  modes: string;
  polling_rate: string;
  battery_capacity: string;
  compatible_systems: string;
};

type InternalSoundDampening = {
  foam_layers: string;
};

type RGBCustomization = {
  backlight: string;
  software_support: string;
};

type Specifications = {
  general: GeneralSpecs;
  switch_typing_experience: SwitchTypingExperience;
  plate_pcb: PlatePCB;
  keycaps: Keycaps;
  connectivity_compatibility: ConnectivityCompatibility;
  internal_sound_dampening: InternalSoundDampening;
  rgb_customization: RGBCustomization;
  additional_features: string[];
};

// Main product type
type Products = {
  title: string;
  information: ProductFeature[];
  images: string[];
  price: number;
  availability: string;
  quantity: number;
  brand: string;
  reviews: Review[];
  description: string;
  specifications: Specifications;
  warranty: string;
  weight: string;
  category: string;
};

// Array of products
type ProductList = Product[];

// Define TypeScript interfaces
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock_quantity: number;
  category: string;
  brand: string;
}

interface SearchParams {
  q?: string;
  minPrice?: string;
  maxPrice?: string;
  categories?: string;
  brands?: string;
  inStock?: string;
}

// Demo product data
const demoProducts: Product[] = [
  {
    id: "1",
    name: "Electric Guitar",
    description: "Professional electric guitar with amazing sound quality",
    price: 799.99,
    image_url: "/placeholder.svg?height=400&width=400&text=Guitar",
    stock_quantity: 5,
    category: "String Instruments",
    brand: "Fender",
  },
  {
    id: "2",
    name: "Acoustic Drum Set",
    description: "Complete drum set for beginners and professionals",
    price: 1299.99,
    image_url: "/placeholder.svg?height=400&width=400&text=Drums",
    stock_quantity: 3,
    category: "Percussion",
    brand: "Pearl",
  },
  {
    id: "3",
    name: "Digital Piano",
    description: "88-key weighted digital piano with authentic sound",
    price: 649.99,
    image_url: "/placeholder.svg?height=400&width=400&text=Piano",
    stock_quantity: 8,
    category: "Keyboard Instruments",
    brand: "Yamaha",
  },
  {
    id: "4",
    name: "Saxophone",
    description: "Professional alto saxophone with gold lacquer finish",
    price: 1099.99,
    image_url: "/placeholder.svg?height=400&width=400&text=Saxophone",
    stock_quantity: 2,
    category: "Wind Instruments",
    brand: "Selmer",
  },
  {
    id: "5",
    name: "Electric Bass",
    description: "4-string electric bass guitar with active pickups",
    price: 549.99,
    image_url: "/placeholder.svg?height=400&width=400&text=Bass",
    stock_quantity: 6,
    category: "String Instruments",
    brand: "Ibanez",
  },
  {
    id: "6",
    name: "Violin",
    description: "Handcrafted violin with spruce top and maple back",
    price: 899.99,
    image_url: "/placeholder.svg?height=400&width=400&text=Violin",
    stock_quantity: 4,
    category: "String Instruments",
    brand: "Stradivarius",
  },
  {
    id: "7",
    name: "Acoustic Guitar",
    description: "Dreadnought acoustic guitar with solid wood construction",
    price: 499.99,
    image_url: "/placeholder.svg?height=400&width=400&text=Acoustic+Guitar",
    stock_quantity: 10,
    category: "String Instruments",
    brand: "Martin",
  },
  {
    id: "8",
    name: "Electronic Keyboard",
    description: "61-key portable keyboard with built-in speakers",
    price: 299.99,
    image_url: "/placeholder.svg?height=400&width=400&text=Keyboard",
    stock_quantity: 12,
    category: "Keyboard Instruments",
    brand: "Casio",
  },
  {
    id: "9",
    name: "Trumpet",
    description: "Professional Bb trumpet with monel valves",
    price: 749.99,
    image_url: "/placeholder.svg?height=400&width=400&text=Trumpet",
    stock_quantity: 0,
    category: "Wind Instruments",
    brand: "Bach",
  },
  {
    id: "10",
    name: "DJ Controller",
    description: "Professional DJ controller with built-in sound card",
    price: 449.99,
    image_url: "/placeholder.svg?height=400&width=400&text=DJ+Controller",
    stock_quantity: 7,
    category: "Electronic",
    brand: "Pioneer",
  },
];

// Demo categories and brands
const demoCategories: string[] = [
  "String Instruments",
  "Percussion",
  "Keyboard Instruments",
  "Wind Instruments",
  "Electronic",
];

const demoBrands: string[] = [
  "Fender",
  "Pearl",
  "Yamaha",
  "Selmer",
  "Ibanez",
  "Stradivarius",
  "Martin",
  "Casio",
  "Bach",
  "Pioneer",
];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = await createClient();
  const { data: keyboards } = await supabase
    .from("keyboards")
    .select<"keyboards", Products>();

  const query = (await searchParams).q || "";
  const minPrice = Number((await searchParams).minPrice) || 0;
  const maxPrice = Number((await searchParams).maxPrice) || 20000;
  const categories = (await searchParams).categories?.split(",") || [];
  const brands = (await searchParams).brands?.split(",") || [];
  const inStock = (await searchParams).inStock === "true";
  // Filter products based on search params
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {query ? `Search results for "${query}"` : "Products"}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <ProductFilters
            categories={demoCategories}
            brands={demoBrands}
            maxPrice={20000}
          />
        </div>

        <div className="lg:col-span-3">
          <ProductGrid products={filteredProducts} />
        </div>
      </div>
      <Toaster />
    </div>
  );
}
