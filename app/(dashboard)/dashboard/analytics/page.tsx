"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { RevenueChart } from "@/components/revenue-chart"
import { UserAnalytics } from "@/components/user-analytics"
import { ProductAnalytics } from "@/components/product-analytics"
import { TrendingUp, TrendingDown, Users, DollarSign, ShoppingCart } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export default function AnalyticsPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [profiles, setProfiles] = useState<any[]>([])
  const [metrics, setMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      setLoading(true)

      try {
        const [
          { data: ordersData },
          { data: profilesData },
          { data: metricsData }
        ] = await Promise.all([
          supabase.from("orders").select("*").order("order_date", { ascending: false }),
          supabase.from('user_analytics').select('*'),
          supabase.rpc('get_analytics_metrics')
        ])

        setOrders(ordersData ?? [])
        setProfiles(profilesData ?? [])
        setMetrics(metricsData ?? null)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const calculateMetrics = () => {
    if (!orders.length || !profiles.length) return null

    const totalRevenue = orders
      .filter(order => order.status !== 'Cancelled')
      .reduce((sum, order) => sum + order.total_amount, 0)

    const now = new Date()
    const currentPeriodStart = new Date(now)
    currentPeriodStart.setDate(currentPeriodStart.getDate() - 30)
    const previousPeriodStart = new Date(currentPeriodStart)
    previousPeriodStart.setDate(previousPeriodStart.getDate() - 30)

    const currentPeriodRevenue = orders
      .filter(order => {
        const orderDate = new Date(order.order_date)
        return orderDate >= currentPeriodStart && order.status !== 'Cancelled'
      })
      .reduce((sum, order) => sum + order.total_amount, 0)

    const previousPeriodRevenue = orders
      .filter(order => {
        const orderDate = new Date(order.order_date)
        return orderDate >= previousPeriodStart && orderDate < currentPeriodStart && order.status !== 'Cancelled'
      })
      .reduce((sum, order) => sum + order.total_amount, 0)

    const revenueChange = previousPeriodRevenue > 0
      ? ((currentPeriodRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100
      : 100

    const activeUsers = profiles.filter(profile => {
      if (!profile.last_sign_in_at) return false
      const lastSignIn = new Date(profile.last_sign_in_at)
      return lastSignIn >= currentPeriodStart
    }).length

    const previousActiveUsers = profiles.filter(profile => {
      if (!profile.last_sign_in_at) return false
      const lastSignIn = new Date(profile.last_sign_in_at)
      return lastSignIn >= previousPeriodStart && lastSignIn < currentPeriodStart
    }).length

    const activeUsersChange = previousActiveUsers > 0
      ? ((activeUsers - previousActiveUsers) / previousActiveUsers) * 100
      : 100

    const totalOrders = orders.length
    const currentPeriodOrders = orders.filter(order => {
      const orderDate = new Date(order.order_date)
      return orderDate >= currentPeriodStart
    }).length

    const previousPeriodOrders = orders.filter(order => {
      const orderDate = new Date(order.order_date)
      return orderDate >= previousPeriodStart && orderDate < currentPeriodStart
    }).length

    const ordersChange = previousPeriodOrders > 0
      ? ((currentPeriodOrders - previousPeriodOrders) / previousPeriodOrders) * 100
      : 100

    const totalCost = orders
      .filter(order => order.status !== 'Cancelled')
      .reduce((sum, order) => sum + (order.total_amount * 0.7), 0) 
    const profitMargin = totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0

    const previousProfitMargin = 30 // This would come from your historical data

    const profitMarginChange = profitMargin - previousProfitMargin

    return {
      totalRevenue,
      revenueChange,
      profitMargin,
      profitMarginChange,
      activeUsers,
      activeUsersChange,
      totalOrders,
      ordersChange
    }
  }

  const analyticsMetrics = calculateMetrics() || metrics
  const analyticsData = [
    {
      title: "Total Revenue",
      value: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(analyticsMetrics?.totalRevenue || 0),
      change: `${analyticsMetrics?.revenueChange ? Math.abs(analyticsMetrics.revenueChange).toFixed(1) : 0}%`,
      trend: analyticsMetrics?.revenueChange >= 0 ? "up" : "down",
      icon: DollarSign,
    },
    {
      title: "Profit Margin",
      value: `${analyticsMetrics?.profitMargin ? analyticsMetrics.profitMargin.toFixed(1) : 0}%`,
      change: `${analyticsMetrics?.profitMarginChange ? Math.abs(analyticsMetrics.profitMarginChange).toFixed(1) : 0}%`,
      trend: analyticsMetrics?.profitMarginChange >= 0 ? "up" : "down",
      icon: TrendingUp,
    },
    {
      title: "Active Users",
      value: analyticsMetrics?.activeUsers || 0,
      change: `${analyticsMetrics?.activeUsersChange ? Math.abs(analyticsMetrics.activeUsersChange).toFixed(1) : 0}%`,
      trend: analyticsMetrics?.activeUsersChange >= 0 ? "up" : "down",
      icon: Users,
    },
    {
      title: "Total Orders",
      value: analyticsMetrics?.totalOrders || 0,
      change: `${analyticsMetrics?.ordersChange ? Math.abs(analyticsMetrics.ordersChange).toFixed(1) : 0}%`,
      trend: analyticsMetrics?.ordersChange >= 0 ? "up" : "down",
      icon: ShoppingCart,
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground hidden sm:block">Comprehensive insights into your store performance</p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {analyticsData.map((item, index) => (
          <motion.div
            key={item.title}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">{item.title}</CardTitle>
                <item.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{item.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {item.trend === "up" ? (
                    <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                  )}
                  <span className={item.trend === "up" ? "text-green-500" : "text-red-500"}>{item.change}</span>
                  <span className="ml-1 hidden sm:inline">from last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription className="hidden sm:block">Monthly revenue trends with profit margin</CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueChart orders={orders} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>User Analytics</CardTitle>
            <CardDescription className="hidden sm:block">User growth and engagement metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <UserAnalytics authUsers={profiles} />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales Performance</CardTitle>
            <CardDescription className="hidden sm:block">Monthly sales comparison</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview orders={orders} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Product Analytics</CardTitle>
            <CardDescription className="hidden sm:block">Top performing products</CardDescription>
          </CardHeader>
          <CardContent>
            <ProductAnalytics orders={orders} />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}