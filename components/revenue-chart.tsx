"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

type MonthlyData = {
  month: string
  revenue: number
  profit: number
}

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  profit: {
    label: "Profit",
    color: "hsl(var(--chart-2))",
  },
}

export function RevenueChart({ orders }: { orders: any[] }) {
  const processOrdersData = (orders: any[]): MonthlyData[] => {

    const monthlyData: Record<string, { revenue: number; profit: number }> = {}
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    months.forEach(month => {
      monthlyData[month] = { revenue: 0, profit: 0 }
    })
    
    orders.forEach(order => {
      if (order.status !== 'Cancelled') { 
        const orderDate = new Date(order.order_date)
        const month = months[orderDate.getMonth()]
        const orderTotal = order.total_amount
        

        const profit = orderTotal * 0.3
        
        monthlyData[month].revenue += orderTotal
        monthlyData[month].profit += profit
      }
    })
    
    return months.map(month => ({
      month,
      revenue: monthlyData[month].revenue,
      profit: monthlyData[month].profit,
    }))
  }

  const data = processOrdersData(orders)

  return (
    <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis
            dataKey="month"
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
          <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="profit" stroke="var(--color-profit)" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}