"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { RevenueChart } from "@/components/revenue-chart"
import { UserAnalytics } from "@/components/user-analytics"
import { ProductAnalytics } from "@/components/product-analytics"
import { TrendingUp, TrendingDown, Users, DollarSign, ShoppingCart } from "lucide-react"

const analyticsData = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Profit Margin",
    value: "32.4%",
    change: "+2.1%",
    trend: "up",
    icon: TrendingUp,
  },
  {
    title: "Active Users",
    value: "2,350",
    change: "-5.2%",
    trend: "down",
    icon: Users,
  },
  {
    title: "Total Orders",
    value: "1,234",
    change: "+12.5%",
    trend: "up",
    icon: ShoppingCart,
  },
]

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
            <CardDescription className="hidden sm:block">Monthly revenue trends</CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>User Analytics</CardTitle>
            <CardDescription className="hidden sm:block">User growth and engagement metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <UserAnalytics />
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
            <Overview />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Product Analytics</CardTitle>
            <CardDescription className="hidden sm:block">Top performing products</CardDescription>
          </CardHeader>
          <CardContent>
            <ProductAnalytics />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
