"use client"

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { month: "Jan", newUsers: 400, activeUsers: 240 },
  { month: "Feb", newUsers: 300, activeUsers: 139 },
  { month: "Mar", newUsers: 200, activeUsers: 980 },
  { month: "Apr", newUsers: 278, activeUsers: 390 },
  { month: "May", newUsers: 189, activeUsers: 480 },
  { month: "Jun", newUsers: 239, activeUsers: 380 },
]

const chartConfig = {
  newUsers: {
    label: "New Users",
    color: "hsl(var(--chart-3))",
  },
  activeUsers: {
    label: "Active Users",
    color: "hsl(var(--chart-4))",
  },
}

export function UserAnalytics() {
  return (
    <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <XAxis
            dataKey="month"
            stroke="#888888"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            className="sm:text-xs"
          />
          <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} className="sm:text-xs" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="activeUsers"
            stackId="1"
            stroke="var(--color-activeUsers)"
            fill="var(--color-activeUsers)"
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="newUsers"
            stackId="1"
            stroke="var(--color-newUsers)"
            fill="var(--color-newUsers)"
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
