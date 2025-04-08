"use client";

import { useCart } from "@/context/cart-context";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function ConfirmPaymentPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();
  const router = useRouter();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Confirm Payment</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Cart Items */}
        <div>
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.title} className="w-16 h-16 object-cover" />
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p>${item.price.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span>{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <Separator className="my-4" />
          <div className="text-right">
            <p className="text-lg font-semibold">Total: ${totalPrice.toFixed(2)}</p>
          </div>
        </div>

        {/* Right Side: Payment Options */}
        <div>
          <Elements stripe={stripePromise}>
            <CheckoutForm totalPrice={totalPrice} />
          </Elements>
        </div>
      </div>
    </div>
  );
}

const CheckoutForm = ({ totalPrice }: { totalPrice: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment intent
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalPrice * 100 }), // Convert to cents
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create payment intent");
      }

      const { clientSecret } = data;

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (error) {
        alert(`Payment failed: ${error.message}`);
      } else if (paymentIntent.status === "succeeded") {
        alert("Payment successful!");
        router.push("/success"); // Redirect to success page
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <Button type="submit" disabled={isProcessing} className="w-full mt-4">
        {isProcessing ? "Processing..." : "Pay Now"}
      </Button>
    </form>
  );
};