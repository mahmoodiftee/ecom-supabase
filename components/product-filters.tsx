"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CheckedState } from "@radix-ui/react-checkbox"

interface ProductFiltersProps {
  categories?: string[]
  brands?: string[]
  maxPrice?: number
}

export default function ProductFilters({  brands = [], maxPrice = 1000 }: ProductFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Get filter values from URL
  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get("minPrice") || 0),
    Number(searchParams.get("maxPrice") || maxPrice),
  ])

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("categories")?.split(",") || []
  )

  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.get("brands")?.split(",") || []
  )

  const [inStock, setInStock] = useState(searchParams.get("inStock") === "true")

  // Apply filters
  const applyFilters = () => {
    const params = new URLSearchParams(searchParams)

    // Price range
    params.set("minPrice", priceRange[0].toString())
    params.set("maxPrice", priceRange[1].toString())
    // Brands
    if (selectedBrands.length > 0) {
      params.set("brands", selectedBrands.join(","))
    } else {
      params.delete("brands")
    }

    // Stock
    if (inStock) {
      params.set("inStock", "true")
    } else {
      params.delete("inStock")
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  // Clear all filters
  const clearFilters = () => {
    setPriceRange([0, maxPrice])
    setSelectedCategories([])
    setSelectedBrands([])
    setInStock(false)

    // Remove filter params from URL
    const params = new URLSearchParams(searchParams)
    params.delete("minPrice")
    params.delete("maxPrice")
    params.delete("categories")
    params.delete("brands")
    params.delete("inStock")

    // Keep search query if exists
    const query = params.get("q")

    if (query) {
      router.push(`${pathname}?q=${query}`)
    } else {
      router.push(pathname)
    }
  }

  // Apply filters when values change
  useEffect(() => {
    const debouncedApplyFilters = setTimeout(() => {
      applyFilters()
    }, 500)

    return () => clearTimeout(debouncedApplyFilters)
  }, [priceRange, selectedCategories, selectedBrands, inStock])

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]))
  }

  const handleStockChange = (checked: CheckedState) => {
    setInStock(checked === true)
  }

  return (
    <div className="sticky top-20 space-y-6">
      <div>
        <h3 className="font-medium text-lg mb-4">Filters</h3>
        <Button variant="outline" size="sm" className="mb-6" onClick={clearFilters}>
          Clear filters
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={["price", "category", "brand", "availability"]}>
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <Slider value={priceRange} max={maxPrice} step={10} onValueChange={setPriceRange} />
              <div className="flex items-center justify-between">
                <p className="text-sm">${priceRange[0]}</p>
                <p className="text-sm">${priceRange[1]}</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* <AccordionItem value="category">
          <AccordionTrigger>Category</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                  />
                  <Label htmlFor={`category-${category}`}>{category}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem> */}

        <AccordionItem value="brand">
          <AccordionTrigger>Brand</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={selectedBrands.includes(brand)}
                    onCheckedChange={() => toggleBrand(brand)}
                  />
                  <Label htmlFor={`brand-${brand}`}>{brand}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="availability">
          <AccordionTrigger>Availability</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="in-stock" checked={inStock} onCheckedChange={handleStockChange} />
                <Label htmlFor="in-stock">In Stock</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
