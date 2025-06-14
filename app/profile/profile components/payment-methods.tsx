'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Plus, Trash2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { use, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

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

const AddPaymentForm = ({ onSuccess, onClose, user }: { onSuccess: () => void, onClose: () => void, user: User }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  console.log(user);
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!cardNumber || !expiry || !cvc ) {
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
        setError(supabaseError.message);
        return;
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError('An unexpected error occurred');
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
    } else {
      return value;
    }
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
          {loading ? 'Processing...' : 'Add Payment Method'}
        </Button>
      </div>
    </form>
  );
};

export default function PaymentMethods({ paymentMethods: initialPaymentMethods, user }: PaymentMethodsProps) {

  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    setPaymentMethods(initialPaymentMethods);
  }, [initialPaymentMethods]);

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    const previousMethods = [...paymentMethods];

    setPaymentMethods(paymentMethods.filter(method => method.id !== id));

    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id);

      if (error) throw error;

    } catch (error) {
      setPaymentMethods(previousMethods);
      console.error('Error deleting payment method:', error);
      // toast.error('Failed to delete payment method');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSuccess = () => {
    setRefresh(!refresh);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Manage your saved payment options</CardDescription>
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
              <AddPaymentForm user={user} onSuccess={handleSuccess} onClose={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {paymentMethods.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium">No payment methods</h3>
              <p className="text-gray-500 mt-2">Add a payment method to speed up checkout</p>
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
                <motion.div
                  key={method.id}
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
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">
                            {method.type === "Credit Card"
                              ? `${method.card_number}`
                              : method.email}
                          </h3>
                          {method.default && (
                            <Badge variant="outline" className="text-xs">
                              Default
                            </Badge>
                          )}
                        </div>
                        {method.type === "Credit Card" && (
                          <p className="text-sm text-gray-500">Expires {method.expiry}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!method.default && (
                        <Button variant="outline" size="sm">
                          Set as Default
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500"
                        onClick={() => handleDelete(method.id)}
                        disabled={isDeleting === method.id}
                      >
                        {isDeleting === method.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
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