"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, UserPlus, Filter, Trash, UserRound, UserRoundX, UserRoundCheck } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

type User = {
  id: string;
  full_name: string;
  email: string;
  status: "Registered" | "Blocked" | "Restricted";
  created_at: string;
  avatar_url?: string;
  orders_count?: number;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Registered":
      return "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-900 dark:hover:text-green-300"
    case "Blocked":
      return "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-900 dark:hover:text-red-300"
    case "Restricted":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-900 dark:hover:text-yellow-300"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100 hover:text-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-900 dark:hover:text-gray-300"
  }
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [users, setUsers] = useState<User[]>([])
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      try {
        const { data: usersData, error: usersError } = await supabase
          .from("profiles")
          .select("*")

        if (usersError) throw usersError

        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("user_id, items")

        if (ordersError) throw ordersError

        const ordersCountMap = ordersData.reduce((acc, order) => {
          const count = order.items?.length || 0
          acc[order.user_id] = (acc[order.user_id] || 0) + count
          return acc
        }, {} as Record<string, number>)

        const usersWithOrders = usersData.map(user => ({
          ...user,
          orders_count: ordersCountMap[user.id] || 0
        }))

        setUsers(usersWithOrders)
      } catch (err) {
        console.error("Error fetching data:", err)
      }
    }

    fetchData()
  }, [])

  const updateUserStatus = async (userId: string, newStatus: "Registered" | "Restricted") => {
    // Optimistic update
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    )

    setIsUpdating(prev => ({ ...prev, [userId]: true }))

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("profiles")
        .update({ status: newStatus })
        .eq("id", userId)

      if (error) throw error
    } catch (err) {
      console.error("Failed to update user status:", err)
      // Rollback on error
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, status: users.find(u => u.id === userId)?.status || "Registered" } : user
        )
      )
    } finally {
      setIsUpdating(prev => ({ ...prev, [userId]: false }))
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Users</h2>
        <Button className="w-full sm:w-auto">
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription className="hidden sm:block">
            Manage your store users and their permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Registered">Registered</SelectItem>
                <SelectItem value="Blocked">Blocked</SelectItem>
                <SelectItem value="Restricted">Restricted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >

            <div className="block sm:hidden space-y-4">
              {filteredUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                >

                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <Avatar className="h-12 w-12 flex flex-col items-center justify-center">
                      <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.full_name} />
                      <AvatarFallback className="text-sm font-medium">
                        {user.full_name
                          .split(" ")
                          .map((n: any) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="w-full flex flex-col">
                      <div className="min-w-0">
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium truncate">{user.full_name}</h3>
                          {user.status === "Restricted" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => updateUserStatus(user.id, "Registered")}
                              disabled={isUpdating[user.id]}
                            >
                              {isUpdating[user.id] ? "Updating..." : (
                                <>
                                  <UserRoundCheck className="h-4 w-4 mr-1" />
                                  Activate
                                </>
                              )}
                            </Button>
                          ) : (
                            <Button
                              variant="destructive"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => updateUserStatus(user.id, "Restricted")}
                              disabled={isUpdating[user.id]}
                            >
                              {isUpdating[user.id] ? "Updating..." : (
                                <>
                                  <UserRoundX className="h-4 w-4 mr-1" />
                                  Restrict
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="flex flex-col justify-between items-start">
                          <span className="text-xs text-muted-foreground">
                            orders: 5
                          </span>
                          <span className="text-xs text-muted-foreground">
                            created: {new Date(user.created_at).toLocaleString("en-US", {
                              // weekday: "short",
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              // timeZoneName: "short"
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                </motion.div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Join Date</TableHead>
                    <TableHead className="hidden lg:table-cell">Orders</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.full_name} />
                            <AvatarFallback>
                              {user.full_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.full_name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDate(user.created_at)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {user.orders_count}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {user.status === "Restricted" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => updateUserStatus(user.id, "Registered")}
                              disabled={isUpdating[user.id]}
                            >
                              {isUpdating[user.id] ? "Updating..." : (
                                <>
                                  <UserRoundCheck className="h-4 w-4 mr-1" />
                                  Activate
                                </>
                              )}
                            </Button>
                          ) : (
                            <Button
                              variant="destructive"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => updateUserStatus(user.id, "Restricted")}
                              disabled={isUpdating[user.id]}
                            >
                              {isUpdating[user.id] ? "Updating..." : (
                                <>
                                  <UserRoundX className="h-4 w-4 mr-1" />
                                  Restrict
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}