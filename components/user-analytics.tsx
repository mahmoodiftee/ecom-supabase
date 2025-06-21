"use client"

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

type UserAnalyticsData = {
  month: string
  newUsers: number
  activeUsers: number
}

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

export function UserAnalytics({ authUsers }: { authUsers: any[] }) {
  const processAuthData = (users: any[]): UserAnalyticsData[] => {
    const monthlyData: Record<string, { newUsers: number; activeUsers: number }> = {}
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    months.forEach(month => {
      monthlyData[month] = { newUsers: 0, activeUsers: 0 }
    })
    
    users.forEach(user => {
      try {
        const createdAt = new Date(user.created_at)
        const month = months[createdAt.getMonth()]
        
        monthlyData[month].newUsers += 1
        
        const lastSignIn = user.last_sign_in_at ? new Date(user.last_sign_in_at) : null
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        
        if (lastSignIn && lastSignIn > thirtyDaysAgo) {
          monthlyData[month].activeUsers += 1
        }
      } catch (error) {
        console.error('Error processing user:', user, error)
      }
    })
    
    return months.map(month => ({
      month,
      newUsers: monthlyData[month].newUsers,
      activeUsers: monthlyData[month].activeUsers,
    }))
  }

  const data = processAuthData(authUsers)

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