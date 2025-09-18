"use client";

import { useCart } from "@/context/cart-context";
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { getUserProfile } from "@/utils/profile";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function ConfirmPaymentPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();
  const [user, setUser] = useState<any>(null);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fromCheckout = searchParams.get("fromCheckout");
    if (fromCheckout !== "true") {
      router.push("/");
    }
  }, [router, searchParams]);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data: { user } } = await supabase.auth.getUser();

      if (user?.id) {
        const profile = await getUserProfile(user.id);
        setUser(profile);

        const { data: methods } = await supabase
          .from('payment_methods')
          .select('*')
          .eq('user_id', user.id);

        setPaymentMethods(methods || []);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-center underline text-3xl font-bold mb-6 text-foreground">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
          <h2 className="text-xl font-semibold mb-6 text-foreground">Order Summary</h2>

          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className=" pb-4 border-b border-border last:border-0">
                <div className="flex flex-col md:flex-row items-center gap-4 flex-1">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="md:w-36 md:h-36 object-cover rounded-lg"
                  />
                  <div className="flex flex-col items-start justify-between gap-4">
                    <div>
                      <p className="text-muted-foreground">${item.price.toFixed(0)}</p>
                      <h3 className="font-medium text-foreground">{item.title}</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">${totalPrice.toFixed(0)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium">Free</span>
            </div>
            <div className="flex justify-between items-center text-lg font-semibold mt-4 pt-4 border-t border-border">
              <span className="text-foreground">Total</span>
              <span className="text-primary">${totalPrice.toFixed(0)}</span>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
          <h2 className="text-xl font-semibold mb-6 text-foreground">Payment Details</h2>

          <Elements stripe={stripePromise}>
            <CheckoutForm totalPrice={totalPrice} user={user} paymentMethods={paymentMethods} />
          </Elements>

          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Your payment is securely processed by Stripe. We don't store your credit card details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const CheckoutForm = ({ totalPrice, user, paymentMethods }: { totalPrice: number; user: any, paymentMethods: any[] }) => {
  const { items, clearCart } = useCart();
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
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(totalPrice) }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create payment intent");
      }

      const { clientSecret } = data;

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (error) {
        alert(`Payment failed: ${error.message}`);
      } else if (paymentIntent.status === "succeeded") {
        const orderRes = await fetch("/api/complete-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items,
            totalPrice: Math.round(totalPrice),
            email: user?.email,
            user_id: user?.id,
            user: user
          }),
        });

        if (!orderRes.ok) {
          const errorText = await orderRes.text();
          console.error("Order failed:", errorText);
          throw new Error(errorText || "Order failed");
        }
        const orderData = await orderRes.json();

        if (orderRes.ok && orderData.success) {
          localStorage.setItem(
            "order",
            JSON.stringify({
              items,
              totalPrice: Math.round(totalPrice),
            })
          );
          // localStorage.removeItem("cart");
          // clearCart();
          router.push("/success");
        } else {
          console.error("Order failed:", orderData.error);
          alert("Order processing failed. Please contact support.");
        }
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
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-2">Card Details</label>
        <div className="border border-input rounded-lg p-3">
          {paymentMethods.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">Saved Payment Methods</label>
              <div className="space-y-2">
                {paymentMethods.map((method, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="w-full border rounded-lg p-1.5 md:p-3 flex justify-between items-center hover:bg-accent transition"
                  >
                    <span className="text-xs md:text-base text-foreground">{method.card_number}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs md:text-base text-muted-foreground">{method.expiry}</span>
                      <span className="text-xs md:text-base text-muted-foreground">{method.cvc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="h-10 pt-3 pl-1 rounded-lg">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#ffffff',
                    '::placeholder': {
                      color: '#ffffff',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>

        </div>
      </div>

      <Button
        type="submit"
        disabled={isProcessing || !stripe}
        className="w-full py-6 text-lg"
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing Payment...
          </span>
        ) : (
          `Pay $${totalPrice.toFixed(0)}`
        )}
      </Button>
    </form>
  );
};