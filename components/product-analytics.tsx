import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const topProducts = [
  {
    name: "Wireless Headphones",
    sales: 1234,
    revenue: "$24,680",
    growth: 12.5,
  },
  {
    name: "Smart Watch",
    sales: 987,
    revenue: "$19,740",
    growth: 8.2,
  },
  {
    name: "Laptop Stand",
    sales: 756,
    revenue: "$15,120",
    growth: -2.1,
  },
  {
    name: "Wireless Mouse",
    sales: 543,
    revenue: "$10,860",
    growth: 15.3,
  },
  {
    name: "USB-C Hub",
    sales: 432,
    revenue: "$8,640",
    growth: 5.7,
  },
]

export function ProductAnalytics() {
  const maxSales = Math.max(...topProducts.map((p) => p.sales))

  return (
    <div className="space-y-4">
      {topProducts.map((product, index) => (
        <div key={product.name} className="flex items-center space-x-4">
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium leading-none">{product.name}</p>
              <Badge variant={product.growth > 0 ? "default" : "destructive"}>
                {product.growth > 0 ? "+" : ""}
                {product.growth}%
              </Badge>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{product.sales} sales</span>
              <span>{product.revenue}</span>
            </div>
            <Progress value={(product.sales / maxSales) * 100} className="h-2" />
          </div>
        </div>
      ))}
    </div>
  )
}
