import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"

interface LovedItemsProps {
  items: any[]
}

export default function LovedItems({ items }: LovedItemsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Wishlist</CardTitle>
        <CardDescription>Items you've saved for later</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium">Your wishlist is empty</h3>
            <p className="text-gray-500 mt-2">Save items you love to your wishlist and find them here</p>
            <Button className="mt-4">Start Shopping</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                <div className="flex-shrink-0">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-medium truncate">{item.name}</h3>
                  <p className="text-lg font-bold mt-1">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-500">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
