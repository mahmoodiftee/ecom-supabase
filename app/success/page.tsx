"use client";

import { useCart } from "@/context/cart-context";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { generateReceipt } from "@/lib/pdf-generator";

export default function SuccessPage() {
  const { items, totalPrice, clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  const handleDownloadReceipt = () => {
    generateReceipt(items, totalPrice);
  };

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
      <p className="mb-4">Thank you for your purchase.</p>
      <Button onClick={handleDownloadReceipt}>Download Receipt</Button>
    </div>
  );
}