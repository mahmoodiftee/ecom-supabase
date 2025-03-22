"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import ProductCard from "@/components/product-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Products } from "@/types/products"

export default function ProductGrid({ products }: { products: Products[] }) {
  const [sortOrder, setSortOrder] = useState("featured")

  const sortedProducts = [...products].sort((a, b) => {
    if (sortOrder === "price-asc") return a.price - b.price
    if (sortOrder === "price-desc") return b.price - a.price
    if (sortOrder === "title") return a.title.localeCompare(b.title)
    // Default: featured or newest
    return 0
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">Showing {products.length} products</p>
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="title">Name</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
