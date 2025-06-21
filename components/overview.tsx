"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartConfig = {
  total: {
    label: "Total Revenue",
    color: "hsl(var(--chart-1))",
  },
}

type MonthlyRevenueData = {
  name: string
  total: number
}

export function Overview({ orders }: { orders: any[] }) {
  const processOrdersData = (orders: any[]): MonthlyRevenueData[] => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const monthlyRevenue: Record<string, number> = {}

    months.forEach(month => {
      monthlyRevenue[month] = 0
    })

    orders.forEach(order => {
      if (order.status !== 'Cancelled') { 
        try {
          const orderDate = new Date(order.order_date)
          const month = months[orderDate.getMonth()]
          monthlyRevenue[month] += order.total_amount
        } catch (error) {
          console.error('Error processing order:', order, error)
        }
      }
    })

    return months.map(month => ({
      name: month,
      total: monthlyRevenue[month]
    }))
  }

  const data = processOrdersData(orders)

  return (
    <ChartContainer config={chartConfig} className="h-[250px] sm:h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            className="sm:text-xs"
          />
          <YAxis
            stroke="#888888"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
            className="sm:text-xs"
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="total" fill="var(--color-total)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}