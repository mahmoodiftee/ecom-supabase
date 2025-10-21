"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CheckedState } from "@radix-ui/react-checkbox"
import { X, Filter } from "lucide-react"

interface ProductFiltersProps {
  categories?: string[]
  brands?: string[]
  maxPrice?: number
}

export default function ProductFilters({ brands = [], maxPrice = 1000 }: ProductFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get("minPrice") || 0),
    Number(searchParams.get("maxPrice") || maxPrice),
  ])

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("categories")?.split(",").filter(Boolean) || []
  )

  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.get("brands")?.split(",").filter(Boolean) || []
  )

  const [inStock, setInStock] = useState(searchParams.get("inStock") === "true")

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams)

    params.set("minPrice", priceRange[0].toString())
    params.set("maxPrice", priceRange[1].toString())
    
    if (selectedBrands.length > 0) {
      params.set("brands", selectedBrands.join(","))
    } else {
      params.delete("brands")
    }

    if (selectedCategories.length > 0) {
      params.set("categories", selectedCategories.join(","))
    } else {
      params.delete("categories")
    }

    if (inStock) {
      params.set("inStock", "true")
    } else {
      params.delete("inStock")
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const clearFilters = () => {
    setPriceRange([0, maxPrice])
    setSelectedCategories([])
    setSelectedBrands([])
    setInStock(false)

    const params = new URLSearchParams(searchParams)
    params.delete("minPrice")
    params.delete("maxPrice")
    params.delete("categories")
    params.delete("brands")
    params.delete("inStock")

    const query = params.get("q")

    if (query) {
      router.push(`${pathname}?q=${query}`, { scroll: false })
    } else {
      router.push(pathname, { scroll: false })
    }
  }

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

  const FilterContent = () => (
    <div className="space-y-6">
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
              <Slider 
                value={priceRange} 
                max={maxPrice} 
                min={0}
                step={1} 
                minStepsBetweenThumbs={1}
                onValueChange={setPriceRange}
              />
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">${priceRange[0]}</p>
                <p className="text-sm font-medium">${priceRange[1]}</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

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
                  <Label htmlFor={`brand-${brand}`} className="cursor-pointer">{brand}</Label>
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
                <Label htmlFor="in-stock" className="cursor-pointer">In Stock</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )

  return (
    <>
      <Button
        variant="outline"
        className="lg:hidden mb-4 w-full"
        onClick={() => setIsFilterOpen(true)}
      >
        <Filter className="mr-2 h-4 w-4" />
        Filters
      </Button>

      {isFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFilterOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <FilterContent />
            </div>
            <div className="p-4 border-t">
              <Button
                className="w-full"
                onClick={() => setIsFilterOpen(false)}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="hidden lg:block sticky top-20">
        <FilterContent />
      </div>
    </>
  )
}