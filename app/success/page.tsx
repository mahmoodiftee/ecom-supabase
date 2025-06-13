"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/context/cart-context";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { generateReceipt } from "@/lib/pdf-generator";
import Max from "@/components/max";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Download, ListOrdered, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
interface CheckmarkProps {
  size?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
}
export interface ReceiptDetails {
  receiptNumber: string;
  date: Date;
  customerName?: string;
  customerEmail?: string;
  paymentMethod?: string;
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  companyWebsite?: string;
  notes?: string;
}

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        delay: i * 0.2,
        type: "spring",
        duration: 1.5,
        bounce: 0.2,
        ease: "easeInOut",
      },
      opacity: { delay: i * 0.2, duration: 0.2 },
    },
  }),
};

export function Checkmark({
  size = 100,
  strokeWidth = 2,
  color = "currentColor",
  className = "",
}: CheckmarkProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      initial="hidden"
      animate="visible"
      className={className}
    >
      <title>Animated Checkmark</title>
      <motion.circle
        cx="50"
        cy="50"
        r="40"
        stroke={color}
        variants={draw}
        custom={0}
        style={{
          strokeWidth,
          strokeLinecap: "round",
          fill: "transparent",
        }}
      />
      <motion.path
        d="M30 50L45 65L70 35"
        stroke={color}
        variants={draw}
        custom={1}
        style={{
          strokeWidth,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          fill: "transparent",
        }}
      />
    </motion.svg>
  );
}

export default function SuccessPage() {
  const [items, setItems] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const orderData = localStorage.getItem("order");
    if (orderData) {
      const { items, totalPrice } = JSON.parse(orderData);
      setItems(items);
      setTotalPrice(totalPrice);
    } else {
      console.log("No order found in localStorage");
    }
  }, []);


  const details = {
    receiptNumber: "REC-2025-001",
    date: new Date(),
    customerName: "Mahmood Iftee",
    customerEmail: "mahmoodiftee@gmail.com",
    paymentMethod: "Visa Card",
    companyName: "CapKeys",
    companyAddress: "Gulshan 1, Dhaka, Bangladesh",
    companyPhone: "+88 0123456789",
    companyEmail: "contact@capekeys.com",
    companyWebsite: "www.capekeys.com",
    notes: "Thank you for your business!",
  };
  console.log(Math.round(totalPrice));
  const handleDownloadReceipt = () => {
    generateReceipt(items, totalPrice, details);
  };

  return (
    <Max>
      <Card className="w-full max-w-sm md:max-w-3xl mx-auto p-6 min-h-[300px] flex flex-col justify-center dark:bg-zinc-900 bg-white dark:border-zinc-800 border-zinc-200 backdrop-blur-sm">
        <CardContent className="space-y-4 flex flex-col items-center justify-center">
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1],
              scale: {
                type: "spring",
                damping: 15,
                stiffness: 200,
              },
            }}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 blur-xl dark:bg-emerald-500/10 bg-emerald-500/20 rounded-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.2,
                  duration: 0.8,
                  ease: "easeOut",
                }}
              />
              <Checkmark
                size={80}
                strokeWidth={4}
                color="rgb(16 185 129)"
                className="relative z-10 dark:drop-shadow-[0_0_10px_rgba(0,0,0,0.1)]"
              />
            </div>
          </motion.div>
          <motion.div
            className="space-y-2 text-center w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.2,
              duration: 0.6,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            <motion.h2
              className="text-lg dark:text-zinc-100 text-zinc-900 tracking-tighter font-semibold uppercase"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.4 }}
            >
              Payment Submitted
            </motion.h2>
            <motion.h2
              className="text-lg dark:text-zinc-100 text-zinc-900 tracking-tighter font-semibold uppercase"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.4 }}
            >
              <div className="flex gap-2 justify-center my-3 mb-6">
                <Button className="" onClick={handleDownloadReceipt}>
                  <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Download Receipt
                </Button>
                <Link href="/profile?tab=orders">
                  <Button variant={"outline"} className="">
                    <ShoppingBag className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    View Orders
                  </Button>
                </Link>
              </div>
            </motion.h2>

            <div className="flex items-center gap-4">
              <motion.div
                className="flex-1 dark:bg-zinc-800/50 bg-zinc-50/50 rounded-xl p-3 border dark:border-zinc-700/50 border-zinc-200/50 backdrop-blur-md"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 1.2,
                  duration: 0.4,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                <div className="flex flex-col items-start gap-2">
                  <div className="space-y-1.5">
                    <span className="text-xs font-medium dark:text-zinc-500 text-zinc-400 flex items-center gap-1.5">
                      From : Mahmood Iftee
                    </span>
                    <div className="flex items-center gap-2.5 group transition-all">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-zinc-900 dark:bg-white shadow-lg border border-zinc-700 dark:border-zinc-300 text-sm font-medium text-zinc-100 dark:text-zinc-900 group-hover:scale-105 transition-transform">
                        ৳
                      </span>
                      <span className="font-medium dark:text-zinc-100 text-zinc-900 tracking-tight">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-px bg-gradient-to-r from-transparent dark:via-zinc-700 via-zinc-300 to-transparent" />
                  <div className="w-full flex-1 overflow-y-auto space-y-4 ">
                    {items.map((item: any, i: number) => (
                      <div key={i} className="w-full">
                        <div key={i} className="w-full flex gap-4">
                          <div className="h-20 w-20 relative rounded overflow-hidden flex-shrink-0">
                            <Image
                              src={
                                item.image ||
                                "/placeholder.svg?height=80&width=80"
                              }
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 flex flex-col justify-center items-start">
                            <h3 className="font-medium">
                              {item.title.length > 5
                                ? `${item.title.slice(0, 35)}...`
                                : item.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              ${item.price.toFixed(2)} x {item.quantity}
                            </p>
                          </div>
                        </div>
                        <div className="my-4 w-full h-px bg-gradient-to-r from-transparent dark:via-zinc-700 via-zinc-300 to-transparent" />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </Max>
  );
}
