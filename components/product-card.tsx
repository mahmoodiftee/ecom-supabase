"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { toast } from "@/components/ui/use-toast";
import { Products } from "@/types/products";

export default function ProductCard({ product }: { product: Products }) {
  const router = useRouter();
  const { addItem } = useCart();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent navigation if clicking the add to cart button
    if (
      e.target instanceof HTMLElement &&
      e.target.closest("button[data-cart-button]")
    ) {
      e.preventDefault();
      return;
    }

    router.push(
      `/keyboards/${product.id}?name=${encodeURIComponent(
        product.title.replace(/\s+/g, "-")
      )}`
    );
  };

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    addItem(
      {
        ...product,
        price: product.price * (1 - product.discount / 100),
      },
      1
    );
    toast({
      title: "Added to cart",
      description: `${product.title} added to your cart`,
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      onClick={handleClick}
      className="cursor-pointer"
    >
      <Card className="overflow-hidden h-full transition-all duration-200 hover:shadow-md">
        {/* Centered image container with white background */}
        <div className="aspect-square relative overflow-hidden bg-white flex items-center justify-center">
          <motion.div
            className="w-full h-full"
            layoutId={`product-image-${product.id}`}
          >
            <img
              src={product.image || "/placeholder.svg?height=400&width=400"}
              alt={product.title}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </motion.div>
          {product.quantity <= 5 && product.quantity > 0 && (
            <Badge variant="secondary" className="absolute top-2 right-2">
              Only {product.quantity} left
            </Badge>
          )}
          {product.quantity === 0 && (
            <Badge variant="destructive" className="absolute top-2 right-2">
              Out of stock
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <motion.h2
            className="font-medium text-lg line-clamp-1"
            layoutId={`product-title-${product.id}`}
          >
            {product.title}
          </motion.h2>
          <p className="text-muted-foreground text-sm line-clamp-2 mt-1 mb-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <motion.p
              className="font-bold text-lg"
              layoutId={`product-price-${product.id}`}
            >
              ৳ {(product.price! * (1 - product.discount / 100)).toFixed(2)}
            </motion.p>
            <Button
              size="sm"
              variant="ghost"
              className="rounded-full h-8 w-8 p-0"
              onClick={handleAddToCart}
              disabled={product.quantity <= 0}
              data-cart-button
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
