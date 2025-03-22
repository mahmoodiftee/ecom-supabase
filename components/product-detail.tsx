"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronLeft, Minus, Plus, ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/context/cart-context"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

export default function ProductDetail({ product }) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const router = useRouter()

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    if (quantity < (product.stock_quantity || 10)) {
      setQuantity(quantity + 1)
    }
  }

  const handleAddToCart = () => {
    addItem(product, quantity)
    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.title} added to your cart`,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/products" className="inline-flex items-center text-sm mb-8 hover:underline">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <motion.div
          layoutId={`product-image-${product.id}`}
          transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="aspect-square relative rounded-lg overflow-hidden">
            <Image
              src={product.image_url || "/placeholder.svg?height=600&width=600"}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col"
        >
          <motion.h1 layoutId={`product-title-${product.id}`} className="text-3xl font-bold">
            {product.title}
          </motion.h1>

          <motion.div layoutId={`product-price-${product.id}`} className="text-2xl font-bold mt-2">
            ${product.price?.toFixed(2)}
          </motion.div>

          <div className="mt-6">
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <Separator className="my-6" />

          <div className="space-y-6">
            {product.stock_quantity > 0 ? (
              <div className="flex items-center">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  In Stock
                </Badge>
                <span className="ml-2 text-sm text-muted-foreground">{product.stock_quantity} available</span>
              </div>
            ) : (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                Out of Stock
              </Badge>
            )}

            <div className="flex items-center">
              <Button variant="outline" size="icon" onClick={decreaseQuantity} disabled={quantity <= 1}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="mx-4 w-8 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={increaseQuantity}
                disabled={quantity >= (product.stock_quantity || 10)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="flex-1" size="lg" onClick={handleAddToCart} disabled={product.stock_quantity <= 0}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="mr-2 h-5 w-5" />
                Add to Wishlist
              </Button>
            </div>
          </div>

          <Separator className="my-8" />

          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
              <TabsTrigger value="returns">Returns</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-4">
              <div className="text-sm space-y-2">
                <p>Product details would go here. This would include materials, dimensions, care instructions, etc.</p>
              </div>
            </TabsContent>
            <TabsContent value="shipping" className="mt-4">
              <div className="text-sm space-y-2">
                <p>Free shipping on orders over $50. Standard delivery 3-5 business days.</p>
                <p>Express delivery available at checkout.</p>
              </div>
            </TabsContent>
            <TabsContent value="returns" className="mt-4">
              <div className="text-sm space-y-2">
                <p>Return this product within 30 days of receipt for a full refund.</p>
                <p>Items must be unused and in original packaging.</p>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}

