"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Receipt } from "@/types/gTypes";

export default function Receipt({ receipt }: { receipt: Receipt }) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const printReceipt = () => {
    if (receiptRef.current) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Receipt - ${receipt.id}</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .receipt { max-width: 800px; margin: 0 auto; }
                .header { text-align: center; margin-bottom: 20px; }
                .items { width: 100%; border-collapse: collapse; margin: 20px 0; }
                .items th, .items td { padding: 10px; text-align: left; }
                .items th { border-bottom: 1px solid #ddd; }
                .items tr:last-child { border-top: 1px solid #ddd; }
                .footer { display: flex; justify-content: space-between; }
                .totals { margin-left: auto; width: 200px; }
                .total-row { display: flex; justify-content: space-between; padding: 5px 0; }
                .grand-total { font-weight: bold; border-top: 1px solid #ddd; padding-top: 10px; }
              </style>
            </head>
            <body>
              <div class="receipt">
                <div class="header">
                  <h1>Receipt</h1>
                  <p>Order #: ${receipt.id}</p>
                  <p>Date: ${receipt.date}</p>
                  <p>Email: ${receipt.customerEmail}</p>
                </div>
                
                <table class="items">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${receipt.items
                      .map(
                        (item: any) => `
                      <tr>
                        <td>${item.name}</td>
                        <td>$${item.price.toFixed(2)}</td>
                        <td>${item.quantity}</td>
                        <td>$${item.total.toFixed(2)}</td>
                      </tr>
                    `
                      )
                      .join("")}
                  </tbody>
                </table>
                
                <div class="totals">
                  <div class="total-row">
                    <span>Subtotal:</span>
                    <span>$${receipt.subtotal.toFixed(2)}</span>
                  </div>
                  <div class="total-row">
                    <span>Tax:</span>
                    <span>$${receipt.tax.toFixed(2)}</span>
                  </div>
                  <div class="total-row grand-total">
                    <span>Total:</span>
                    <span>$${receipt.total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div class="footer">
                  <p>Payment Method: ${receipt.paymentMethod}</p>
                </div>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const downloadReceipt = () => {
    try {
      const receiptData = JSON.stringify(receipt, null, 2);
      const blob = new Blob([receiptData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `receipt-${receipt.id}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Receipt Downloaded",
        description: "Your receipt has been downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was a problem downloading your receipt",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border-dashed">
      <div ref={receiptRef}>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Receipt</CardTitle>
          <div className="text-sm text-muted-foreground">
            <p>Order #: {receipt.id}</p>
            <p>Date: {receipt.date}</p>
            <p>Email: {receipt.customerEmail}</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left">Item</th>
                    <th className="px-4 py-3 text-right">Price</th>
                    <th className="px-4 py-3 text-right">Qty</th>
                    <th className="px-4 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {receipt.items.map((item, index) => (
                    <tr
                      key={index}
                      className={
                        index !== receipt.items.length - 1 ? "border-b" : ""
                      }
                    >
                      <td className="px-4 py-3">{item.name}</td>
                      <td className="px-4 py-3 text-right">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right">{item.quantity}</td>
                      <td className="px-4 py-3 text-right">
                        ${item.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="ml-auto w-[240px] space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${receipt.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${receipt.tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>${receipt.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
      <CardFooter className="flex flex-col sm:flex-row gap-2">
        <Button
          onClick={printReceipt}
          variant="outline"
          className="w-full sm:w-auto"
        >
          <Printer className="mr-2 h-4 w-4" />
          Print Receipt
        </Button>
        <Button
          onClick={downloadReceipt}
          variant="outline"
          className="w-full sm:w-auto"
        >
          <Download className="mr-2 h-4 w-4" />
          Download Receipt
        </Button>
      </CardFooter>
    </Card>
  );
}
