"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { RecentSales } from "@/components/recent-sales"
import { CalendarDateRangePicker } from "@/components/date-range-picker"
import { Button } from "@/components/ui/button"
import { Download, Users, ShoppingCart, Package, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { DateRange } from "react-day-picker"

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

export default function DashboardPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [profiles, setProfiles] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [stats, setStats] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      setLoading(true)

      try {
        // Build date filters if range is selected
        const dateFilters = dateRange?.from && dateRange?.to ? {
          gte: dateRange.from.toISOString(),
          lte: dateRange.to.toISOString()
        } : {}

        const [
          { data: ordersData },
          { data: profilesData },
          { data: productsData }
        ] = await Promise.all([
          supabase.from("orders")
            .select("*")
            .gte('order_date', dateFilters.gte || new Date(0).toISOString())
            .lte('order_date', dateFilters.lte || new Date().toISOString())
            .order("order_date", { ascending: false }),
          supabase.from('profiles').select("*"),
          supabase.from('keyboards').select("*")
        ])

        setOrders(ordersData ?? [])
        setProfiles(profilesData ?? [])
        setProducts(productsData ?? [])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [dateRange])

  useEffect(() => {
    // Calculate stats whenever data changes
    if (orders.length > 0 || profiles.length > 0 || products.length > 0) {
      const calculateStats = () => {
        // Revenue calculations
        const totalRevenue = orders
          .filter(order => order.status !== 'Cancelled')
          .reduce((sum, order) => sum + order.total_amount, 0)

        // Previous period comparison (default to last 30 days)
        const now = new Date()
        const currentPeriodStart = dateRange?.from || new Date(now)
        currentPeriodStart.setDate(currentPeriodStart.getDate() - 30)
        const previousPeriodStart = new Date(currentPeriodStart)
        previousPeriodStart.setDate(previousPeriodStart.getDate() - 30)

        const currentPeriodRevenue = orders
          .filter(order => {
            const orderDate = new Date(order.order_date)
            return (!dateRange || (orderDate >= currentPeriodStart)) && 
                   order.status !== 'Cancelled'
          })
          .reduce((sum, order) => sum + order.total_amount, 0)

        const previousPeriodRevenue = orders
          .filter(order => {
            const orderDate = new Date(order.order_date)
            return orderDate >= previousPeriodStart && 
                   orderDate < currentPeriodStart && 
                   order.status !== 'Cancelled'
          })
          .reduce((sum, order) => sum + order.total_amount, 0)

        const revenueChange = previousPeriodRevenue > 0 
          ? ((currentPeriodRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100
          : currentPeriodRevenue > 0 ? 100 : 0

        // Orders calculations
        const totalOrders = orders.length
        const currentPeriodOrders = orders.filter(order => {
          const orderDate = new Date(order.order_date)
          return !dateRange || orderDate >= currentPeriodStart
        }).length

        const previousPeriodOrders = orders.filter(order => {
          const orderDate = new Date(order.order_date)
          return orderDate >= previousPeriodStart && orderDate < currentPeriodStart
        }).length

        const ordersChange = previousPeriodOrders > 0
          ? ((currentPeriodOrders - previousPeriodOrders) / previousPeriodOrders) * 100
          : currentPeriodOrders > 0 ? 100 : 0

        // Products count
        const totalProducts = products.length
        // This would need your business logic for product changes
        const productsChange = 19 // Example value - replace with your logic

        // Active users (last 30 days)
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
          : activeUsers > 0 ? 100 : 0

        return [
          {
            title: "Total Revenue",
            value: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'BDT'
            }).format(totalRevenue),
            change: `${revenueChange >= 0 ? '+' : ''}${Math.abs(revenueChange).toFixed(1)}% from last period`,
            icon: TrendingUp,
          },
          {
            title: "Orders",
            value: `+${currentPeriodOrders}`,
            change: `${ordersChange >= 0 ? '+' : ''}${Math.abs(ordersChange).toFixed(1)}% from last period`,
            icon: ShoppingCart,
          },
          {
            title: "Products",
            value: `+${totalProducts}`,
            change: `+${productsChange}% from last month`, // Replace with your logic
            icon: Package,
          },
          {
            title: "Active Users",
            value: `+${activeUsers}`,
            change: `${activeUsersChange >= 0 ? '+' : ''}${Math.abs(activeUsersChange).toFixed(1)} since last period`,
            icon: Users,
          },
        ]
      }

      setStats(calculateStats())
    }
  }, [orders, profiles, products, dateRange])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div
        variants={itemVariants}
        className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0"
      >
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
          <div className="hidden sm:block">
            <CalendarDateRangePicker onDateChange={setDateRange} />
          </div>
          <Button size="sm" className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground hidden sm:block">{stat.change}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview orders={orders}  />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription className="hidden sm:block">
              {orders.length > 0 ? `You made ${orders.length} sales this period.` : 'No sales data available.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentSales orders={orders} />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}