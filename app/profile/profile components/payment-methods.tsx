'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Plus, Trash2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "@/components/ui/use-toast";

interface PaymentMethod {
  id: string;
  type: string;
  card_number?: string;
  cardNumber?: string;
  last4?: string;
  expiry?: string;
  cvc?: string;
  default: boolean;
  email: string;
}

interface PaymentMethodsProps {
  paymentMethods: PaymentMethod[];
  user: User;
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

const AddPaymentForm = ({ onSuccess, onClose, user }: {
  onSuccess: () => Promise<void>,
  onClose: () => void,
  user: User
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!cardNumber || !expiry || !cvc) {
      setError('Please fill all fields');
      setLoading(false);
      return;
    }

    const last4 = cardNumber.slice(-4);

    try {
      const supabase = await createClient();

      const { error: supabaseError } = await supabase
        .from('payment_methods')
        .insert({
          user_id: user.id,
          cardholder_name: user.user_metadata.full_name,
          type: 'Credit Card',
          card_number: cardNumber,
          last4: last4,
          expiry: expiry,
          cvc: cvc,
          is_default: true
        });

      if (supabaseError) {
        throw supabaseError;
      }

      await onSuccess();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    }
    return value;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/[^0-9]/g, '');
    if (v.length >= 3) {
      return `${v.slice(0, 2)}/${v.slice(2)}`;
    }
    return value;
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value);
    setExpiry(formatted);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cardholderName">Cardholder Name</Label>
        <Input
          id="cardholderName"
          value={user.user_metadata.full_name}
          disabled
          placeholder="John Doe"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cardNumber">Card Number</Label>
        <Input
          id="cardNumber"
          value={cardNumber}
          onChange={handleCardNumberChange}
          placeholder="4242 4242 4242 4242"
          maxLength={19}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiry">Expiry Date</Label>
          <Input
            id="expiry"
            value={expiry}
            onChange={handleExpiryChange}
            placeholder="MM/YY"
            maxLength={5}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cvc">CVC</Label>
          <Input
            id="cvc"
            value={cvc}
            onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
            placeholder="123"
            maxLength={4}
          />
        </div>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          {loading ? 'Processing...' : 'Add Payment Method'}
        </Button>
      </div>
    </form>
  );
};

const PaymentMethodItem = ({
  method,
  onDelete
}: {
  method: PaymentMethod,
  onDelete: (id: string) => Promise<void>
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(method.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      transition={{ duration: 0.3 }}
      className="border rounded-lg p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {method.type === "Credit Card" ? (
            <div className="bg-primary-foreground border p-2 rounded-md">
              <CreditCard className="h-6 w-6" />
            </div>
          ) : (
            <div className="bg-blue-100 p-2 rounded-md">
              <svg
                className="h-6 w-6 text-blue-600"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.5 10.5H17.5M12 3V21M8.5 7.5H15.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
          <div>
            <h3 className="font-medium">
              {method.type === "Credit Card"
                ? `${method.card_number}`
                : method.email}
            </h3>
            <div className="flex items-center justify-between gap-2">
              {method.type === "Credit Card" && (
                <p className="text-sm text-muted-foreground">Expires {method.expiry}</p>
              )}
              <Button
                onClick={handleDelete}
                size="sm"
                variant="ghost"
                className="text-destructive hover:text-destructive"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                <span className="sr-only">Remove</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function PaymentMethods({ paymentMethods: initialPaymentMethods, user }: PaymentMethodsProps) {
  const [open, setOpen] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    setPaymentMethods(initialPaymentMethods);
  }, [initialPaymentMethods]);

  const handleDelete = async (id: string) => {
    const previousMethods = [...paymentMethods];

    // Optimistic update
    setPaymentMethods(prev => prev.filter(method => method.id !== id));

    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id);

      if (error) {
        // Revert if error
        setPaymentMethods(previousMethods);
        throw error;
      }

      toast({
        title: "Success",
        description: "Payment method removed successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete payment method",
      });
    }
  };

  const handleSuccess = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      setPaymentMethods(data || []);
      toast({
        title: "Success",
        description: "Payment method added successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to refresh payment methods",
      });
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader className="flex flex-row items-start md:items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold md:text-2xl md:font-semibold leading-none tracking-tight">
              Manage Payment Methods
            </CardTitle>
            <CardDescription className="leading-none tracking-tight mt-1">
              Manage your saved payment options
            </CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add New
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Payment Method</DialogTitle>
              </DialogHeader>
              <AddPaymentForm
                user={user}
                onSuccess={handleSuccess}
                onClose={() => setOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : paymentMethods.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No payment methods</h3>
              <p className="text-muted-foreground mt-2">
                Add a payment method to speed up checkout
              </p>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          ) : (
            <motion.div
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {paymentMethods.map((method) => (
                <PaymentMethodItem
                  key={method.id}
                  method={method}
                  onDelete={handleDelete}
                />
              ))}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}