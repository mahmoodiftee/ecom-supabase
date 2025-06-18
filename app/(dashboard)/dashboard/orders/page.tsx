"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoreHorizontal, Search, Filter, Eye, CheckIcon, CopyIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { format } from "date-fns";

interface Order {
  id: string;
  customer: string;
  email: string;
  status: string;
  total: string | number;
  date: string;
  items: number;
}

interface OrdersTableProps {
  orders: Order[];
  copiedId: string | null;
  onCopy: (id: string) => void;
  onStatusUpdate: (id: string, status: string) => void;
}
const getStatusColor = (status: string) => {
  switch (status) {
    case "Processing":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "Shipped":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "Delivered":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300";
    case "Cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

const OrderCard = ({
  order,
  index,
  copiedId,
  onStatusUpdate,
  onCopy,
}: {
  order: Order;
  index: number;
  copiedId: string | null;
  onCopy: (id: string) => void;
  onStatusUpdate: (id: string, status: string) => void;
}) => (
  <motion.div
    key={order.id}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
    className="border rounded-lg p-2 md:p-4 space-y-1.5 md:space-y-3"
  >
    <div className="flex items-center justify-between">
      <div>
        <div className="font-medium flex items-center gap-2">
          <span>{order.id.slice(0, 10)}...</span>
          <button
            onClick={() => onCopy(order.id)}
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Copy order ID"
          >
            {copiedId === order.id ? (
              <CheckIcon className="h-4 w-4 text-green-500" />
            ) : (
              <CopyIcon className="h-4 w-4" />
            )}
          </button></div>
        <div className="text-sm text-muted-foreground">{order.customer}</div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem>View details</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Update Status</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => onStatusUpdate(order.id, "Processing")}
          >
            Mark as Processing
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusUpdate(order.id, "Shipped")}>
            Mark as Shipped
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onStatusUpdate(order.id, "Delivered")}
          >
            Mark as Delivered
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onStatusUpdate(order.id, "Cancelled")}
          >
            Mark as Cancelled
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <div className="flex items-center justify-between">
      <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
      <div className="text-right">
        <div className="font-medium">{order.total}</div>
        <div className="text-sm text-muted-foreground">{order.items} items</div>
      </div>
    </div>
    <div className="text-sm text-muted-foreground">{order.date}</div>
  </motion.div>
);

const OrdersTable = ({
  orders,
  copiedId,
  onStatusUpdate,
  onCopy,
}: OrdersTableProps) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Order ID</TableHead>
        <TableHead>Customer</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Total</TableHead>
        <TableHead className="hidden md:table-cell">Date</TableHead>
        <TableHead className="hidden lg:table-cell">Items</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {orders.map((order, index) => (
        <motion.tr
          key={order.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group hover:bg-muted/50"
        >
          <TableCell className="font-medium flex items-center gap-2">
            <span>{order.id.slice(0, 10)}...</span>
            <button
              onClick={() => onCopy(order.id)}
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Copy order ID"
            >
              {copiedId === order.id ? (
                <CheckIcon className="h-4 w-4 text-green-500" />
              ) : (
                <CopyIcon className="h-4 w-4" />
              )}
            </button>
          </TableCell>
          <TableCell>
            <div>
              <div className="font-medium">{order.customer}</div>
              <div className="text-sm text-muted-foreground">{order.email}</div>
            </div>
          </TableCell>
          <TableCell>
            <Badge className={getStatusColor(order.status)}>
              {order.status}
            </Badge>
          </TableCell>
          <TableCell className="font-medium">{order.total}</TableCell>
          <TableCell className="hidden md:table-cell">{order.date}</TableCell>
          <TableCell className="hidden lg:table-cell">{order.items}</TableCell>
          <TableCell className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>View details</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => onStatusUpdate(order.id, "Processing")}
                >
                  Mark as Processing
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onStatusUpdate(order.id, "Shipped")}
                >
                  Mark as Shipped
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onStatusUpdate(order.id, "Delivered")}
                >
                  Mark as Delivered
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onStatusUpdate(order.id, "Cancelled")}
                >
                  Mark as Cancelled
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </motion.tr>
      ))}
    </TableBody>
  </Table>
);

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1000);
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const supabase = createClient();
        const { data, error } = await supabase.from("orders").select("*");

        if (error) throw error;

        if (data) {
          const formattedOrders = data.map((order) => ({
            id: order.id,
            customer: order.order_user?.full_name || "N/A",
            email: order.email || "N/A",
            status: order.status || "N/A",
            total: order.total_amount
              ? `$${order.total_amount.toFixed(2)}`
              : "N/A",
            date: order.order_date
              ? format(new Date(order.order_date), "PPpp")
              : "N/A",
            items: order.items?.length || 0,
          }));
          setOrders(formattedOrders);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      const supabase = createClient();
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;
    } catch (err) {
      console.error("Failed to update order status:", err);
      setOrders(orders);
    }
  };

  const handleExport = () => {
    // Implement export functionality
    console.log("Exporting orders:", filteredOrders);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        Loading orders...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        Error: {error}
      </div>
    );

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Orders
        </h2>
        <Button
          variant="outline"
          className="w-full sm:w-auto"
          onClick={handleExport}
        >
          <Eye className="mr-2 h-4 w-4" />
          Export Orders
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
          <CardDescription className="hidden sm:block">
            Track and manage all customer orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
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
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No orders found matching your criteria
            </div>
          ) : (
            <>
              <div className="block sm:hidden space-y-4">
                {filteredOrders.map((order, index) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    index={index}
                    onStatusUpdate={updateOrderStatus}
                    copiedId={copiedId}
                    onCopy={handleCopy}

                  />
                ))}
              </div>

              <div className="hidden sm:block rounded-md border">
                <OrdersTable
                  orders={filteredOrders}
                  copiedId={copiedId}
                  onStatusUpdate={updateOrderStatus}
                  onCopy={handleCopy}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
