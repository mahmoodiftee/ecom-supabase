"use client"

import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"

type ProductStats = {
  id: number
  name: string
  sales: number
  revenue: number
  growth: number
  revenueFormatted: string
  previousPeriodRevenue: number
}

export function ProductAnalytics({ orders }: { orders: any[] }) {
  const [topProducts, setTopProducts] = useState<ProductStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orders.length) return

    // Process orders to get product statistics
    const processProductData = () => {
      const productMap: Record<number, ProductStats> = {}
      const currentPeriodStart = new Date()
      currentPeriodStart.setMonth(currentPeriodStart.getMonth() - 1) // Last 30 days
      const previousPeriodStart = new Date(currentPeriodStart)
      previousPeriodStart.setMonth(previousPeriodStart.getMonth() - 1) // Previous period

      orders.forEach(order => {
        if (order.status !== 'Cancelled') {
          const orderDate = new Date(order.order_date)
          order.items.forEach((item: any) => {
            if (!productMap[item.id]) {
              productMap[item.id] = {
                id: item.id,
                name: item.title,
                sales: 0,
                revenue: 0,
                growth: 0,
                revenueFormatted: "",
                previousPeriodRevenue: 0
              }
            }

            // Calculate item revenue (price after discount)
            const itemRevenue = item.price * (1 - (item.discount || 0) / 100) * item.quantity

            // Update product stats
            productMap[item.id].sales += item.quantity
            productMap[item.id].revenue += itemRevenue

            // Track previous period revenue for growth calculation
            if (orderDate < currentPeriodStart && orderDate >= previousPeriodStart) {
              productMap[item.id].previousPeriodRevenue += itemRevenue
            }
          })
        }
      })

      // Calculate growth percentage and format data
      const products = Object.values(productMap)
        .map(product => {
          const growth = product.previousPeriodRevenue > 0
            ? ((product.revenue - product.previousPeriodRevenue) / product.previousPeriodRevenue) * 100
            : 100 // If no previous data, assume 100% growth

          return {
            ...product,
            growth: parseFloat(growth.toFixed(1)),
            revenueFormatted: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'BDT'
            }).format(product.revenue)
          }
        })
        .sort((a, b) => b.revenue - a.revenue) // Sort by revenue descending
        .slice(0, 5) // Get top 5 products

      setTopProducts(products)
      setLoading(false)
    }

    processProductData()
  }, [orders])

  if (loading) {
    return <div className="space-y-4">Loading product analytics...</div>
  }

  if (!topProducts.length) {
    return <div className="space-y-4">No product data available</div>
  }

  const maxSales = Math.max(...topProducts.map((p) => p.sales))

  return (
    <div className="space-y-4">
      {topProducts.map((product) => (
        <div key={product.id} className="flex items-center space-x-4">
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
              <span>{product.revenueFormatted}</span>
            </div>
            <Progress value={(product.sales / maxSales) * 100} className="h-2" />
          </div>
        </div>
      ))}
    </div>
  )
}