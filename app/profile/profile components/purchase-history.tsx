'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Eye, Copy } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import { motion } from "framer-motion";

interface PurchaseHistoryProps {
  orders: any[];
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function PurchaseHistory({ orders }: PurchaseHistoryProps) {
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [showFullId, setShowFullId] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copied to clipboard", description: "Order ID copied to clipboard" });
    } catch (err) {
      toast({ title: "Failed to copy!", description: "Order ID Failed to copy!" });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processing":
        return "bg-yellow-100 text-yellow-600";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl sm:text-2xl">Order History</CardTitle>
          <CardDescription className="text-sm sm:text-base">View and track your orders</CardDescription>
        </CardHeader>

        <CardContent className="px-4 sm:px-6">
          {orders.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <Package className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-muted mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium mb-2">No orders yet</h3>
              <p className="text-muted-foreground text-sm sm:text-base mb-4">
                When you place orders, they will appear here
              </p>
              <Button className="w-full sm:w-auto">Start Shopping</Button>
            </div>
          ) : (
            <motion.div
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  variants={itemVariants}
                  transition={{ duration: 0.3 }}
                  className="border rounded-lg p-3 sm:p-4 bg-card"
                >
                  <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-start sm:justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h3 className="font-medium text-sm sm:text-base">Order #{order.id}</h3>
                        <Badge className={`${getStatusColor(order.status)} text-xs w-fit`}>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Placed on{" "}
                        {new Date(order.order_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="flex sm:flex-col sm:text-right items-center sm:items-end justify-between sm:justify-start">
                      <p className="font-bold text-base sm:text-lg">${order.total_amount}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {order.items.length} {order.items.length === 1 ? "item" : "items"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                      {order.items.slice(0, 4).map((item: any, index: number) => (
                        <div key={item.id} className="relative flex-shrink-0">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-md overflow-hidden border">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {index === 3 && order.items.length > 4 && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-md flex items-center justify-center">
                              <span className="text-white text-xs font-medium">
                                +{order.items.length - 4}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto text-xs sm:text-sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="w-[95vw] md:max-w-5xl max-w-2xl max-h-[85vh] overflow-y-auto mx-auto">
                        <DialogHeader className="md:pb-4">
                          <DialogTitle className="text-xs md:text-xl text-start flex items-center gap-2 flex-wrap">
                            Order ID: #
                            <span className="font-mono w-1/2 md:w-auto mr-0 md:mr-4">
                              {showFullId
                                ? selectedOrder?.id
                                : selectedOrder?.id?.slice(0, 20) +
                                  (selectedOrder?.id?.length > 20 ? "..." : "")}
                            </span>
                            {selectedOrder?.id?.length > 10 && (
                              <button
                                onClick={() => setShowFullId((prev) => !prev)}
                                className="text-primary hover:underline text-xs"
                              >
                                <Eye className="inline size-3 md:size-4" />
                              </button>
                            )}
                            <button
                              onClick={() => copyToClipboard(selectedOrder?.id)}
                              className="text-muted-foreground hover:text-foreground text-xs"
                            >
                              <Copy className="inline size-3 md:size-4 ml-1" />
                            </button>
                          </DialogTitle>

                          <DialogDescription className="text-xs md:text-xl text-start">
                            Ordered on{" "}
                            {selectedOrder &&
                              new Date(selectedOrder.order_date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 sm:space-y-6">
                          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <span className="text-sm font-medium">Status:</span>
                            <Badge className={getStatusColor(selectedOrder?.status || "")}>
                              {selectedOrder?.status}
                            </Badge>
                          </div>

                          <div className="space-y-4">
                            <h4 className="font-medium text-base sm:text-lg">Items Ordered</h4>
                            {selectedOrder?.items.map((item: any) => (
                              <Link key={item.id} href={`/keyboards/${item.id}`}>
                                <div className="flex gap-3 sm:gap-4 p-3 border rounded-lg">
                                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                                    <Image
                                      src={item.image || "/placeholder.svg"}
                                      alt={item.title}
                                      fill
                                      className="object-cover rounded-md"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-medium text-xs md:text-base">{item.title}</h5>
                                    <h5 className="font-medium text-xs md:text-base">{item.id}</h5>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 mt-1">
                                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span>Qty: {item.quantity}</span>
                                      </div>
                                      <div className="text-sm font-medium">
                                        ${(item.price * item.quantity).toFixed(2)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>

                          <div className="border-t pt-4">
                            <div className="flex justify-between items-center">
                              <span className="text-base sm:text-lg font-medium">Total:</span>
                              <span className="text-lg sm:text-xl font-bold">${selectedOrder?.total_amount}</span>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
