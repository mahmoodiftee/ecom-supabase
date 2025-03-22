import { notFound } from "next/navigation";
import ProductDetail from "@/components/product-detail";

// Demo product data (same as in products page)
const demoProducts = [
  {
    id: "1",
    name: "Electric Guitar",
    description:
      "Professional electric guitar with amazing sound quality. Features a solid alder body, maple neck, and rosewood fingerboard. Comes with three single-coil pickups and a vintage-style tremolo bridge for classic tones and playability.",
    price: 799.99,
    image_url: "/placeholder.svg?height=600&width=600&text=Guitar",
    stock_quantity: 5,
    category: "String Instruments",
    brand: "Fender",
  },
  {
    id: "2",
    name: "Acoustic Drum Set",
    description:
      'Complete drum set for beginners and professionals. Includes a 22" bass drum, 10", 12", and 16" toms, a 14" snare drum, hi-hat, crash, and ride cymbals. Made with premium birch shells for excellent tone and projection.',
    price: 1299.99,
    image_url: "/placeholder.svg?height=600&width=600&text=Drums",
    stock_quantity: 3,
    category: "Percussion",
    brand: "Pearl",
  },
  {
    id: "3",
    name: "Digital Piano",
    description:
      "88-key weighted digital piano with authentic sound. Features graded hammer action keys, 192-note polyphony, and samples from concert grand pianos. Includes built-in speakers, headphone output, and USB connectivity.",
    price: 649.99,
    image_url: "/placeholder.svg?height=600&width=600&text=Piano",
    stock_quantity: 8,
    category: "Keyboard Instruments",
    brand: "Yamaha",
  },
  {
    id: "4",
    name: "Saxophone",
    description:
      "Professional alto saxophone with gold lacquer finish. Features high F# key, adjustable thumb rest, and includes a case, mouthpiece, and cleaning accessories. Perfect for jazz, classical, and band performances.",
    price: 1099.99,
    image_url: "/placeholder.svg?height=600&width=600&text=Saxophone",
    stock_quantity: 2,
    category: "Wind Instruments",
    brand: "Selmer",
  },
  {
    id: "5",
    name: "Electric Bass",
    description:
      "4-string electric bass guitar with active pickups. Features a solid mahogany body, maple neck, and rosewood fingerboard. Includes active EQ controls for versatile tone shaping and a comfortable, modern design.",
    price: 549.99,
    image_url: "/placeholder.svg?height=600&width=600&text=Bass",
    stock_quantity: 6,
    category: "String Instruments",
    brand: "Ibanez",
  },
  {
    id: "6",
    name: "Violin",
    description:
      "Handcrafted violin with spruce top and maple back. Features ebony fingerboard, pegs, and chinrest. Includes a bow, rosin, and case. Suitable for students and advancing players with a warm, rich tone.",
    price: 899.99,
    image_url: "/placeholder.svg?height=600&width=600&text=Violin",
    stock_quantity: 4,
    category: "String Instruments",
    brand: "Stradivarius",
  },
  {
    id: "7",
    name: "Acoustic Guitar",
    description:
      "Dreadnought acoustic guitar with solid wood construction. Features a solid spruce top, mahogany back and sides, and a comfortable neck profile. Produces a balanced, rich tone ideal for strumming and fingerpicking.",
    price: 499.99,
    image_url: "/placeholder.svg?height=600&width=600&text=Acoustic+Guitar",
    stock_quantity: 10,
    category: "String Instruments",
    brand: "Martin",
  },
  {
    id: "8",
    name: "Electronic Keyboard",
    description:
      "61-key portable keyboard with built-in speakers. Features 400 voices, 100 styles, and 100 songs. Includes lesson function, recording capability, and USB connectivity. Perfect for beginners and practice sessions.",
    price: 299.99,
    image_url: "/placeholder.svg?height=600&width=600&text=Keyboard",
    stock_quantity: 12,
    category: "Keyboard Instruments",
    brand: "Casio",
  },
  {
    id: "9",
    name: "Trumpet",
    description:
      "Professional Bb trumpet with monel valves. Features a lacquered brass body, adjustable slide, and includes a case and mouthpiece. Produces a bright, projecting tone suitable for orchestral, band, and solo performances.",
    price: 749.99,
    image_url: "/placeholder.svg?height=600&width=600&text=Trumpet",
    stock_quantity: 0,
    category: "Wind Instruments",
    brand: "Bach",
  },
  {
    id: "10",
    name: "DJ Controller",
    description:
      "Professional DJ controller with built-in sound card. Features jog wheels, performance pads, and mixer section with EQ and effects controls. Includes software license and is compatible with major DJ applications.",
    price: 449.99,
    image_url: "/placeholder.svg?height=600&width=600&text=DJ+Controller",
    stock_quantity: 7,
    category: "Electronic",
    brand: "Pioneer",
  },
];

export default async function ProductPage({params}: {params: { id: string }}) {
  const { id } = params;
  const product = demoProducts.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
