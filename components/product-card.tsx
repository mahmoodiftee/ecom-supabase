"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { toast } from "@/components/ui/use-toast"

export default function ProductCard({ product }) {
  const router = useRouter()
  const { addItem } = useCart()

  const handleClick = (e) => {
    // Prevent navigation if clicking the add to cart button
    if (e.target.closest("button[data-cart-button]")) {
      e.preventDefault()
      return
    }

    router.push(`/products/${product.id}`)
  }

  const handleAddToCart = (e) => {
    e.stopPropagation()
    addItem(product, 1)
    toast({
      title: "Added to cart",
      description: `${product.title} added to your cart`,
    })
  }

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
        <div className="aspect-square relative overflow-hidden">
          <motion.div layoutId={`product-image-${product.id}`}>
            <Image
              src={product.image_url || "/placeholder.svg?height=400&width=400"}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </motion.div>
          {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
            <Badge variant="secondary" className="absolute top-2 right-2">
              Only {product.stock_quantity} left
            </Badge>
          )}
          {product.stock_quantity === 0 && (
            <Badge variant="destructive" className="absolute top-2 right-2">
              Out of stock
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <motion.h2 className="font-medium text-lg line-clamp-1" layoutId={`product-title-${product.id}`}>
            {product.title}
          </motion.h2>
          <p className="text-muted-foreground text-sm line-clamp-2 mt-1 mb-2">{product.description}</p>
          <div className="flex items-center justify-between">
            <motion.p className="font-bold text-lg" layoutId={`product-price-${product.id}`}>
              ${product.price?.toFixed(2)}
            </motion.p>
            <Button
              size="sm"
              variant="ghost"
              className="rounded-full h-8 w-8 p-0"
              onClick={handleAddToCart}
              disabled={product.stock_quantity <= 0}
              data-cart-button
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="sr-only">Add to cart</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

