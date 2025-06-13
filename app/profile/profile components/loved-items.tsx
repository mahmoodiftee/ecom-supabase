'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface LovedItemsProps {
  items: any[];
  userId: string;
}

export default function LovedItems({ items: initialItems, userId }: LovedItemsProps) {
  const [items, setItems] = useState(initialItems);

  const handleDeleteBookmark = async (productId: number) => {
    const supabase = await createClient();

    const updatedItems = items.filter(item => item.id !== productId);
    setItems(updatedItems);

    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", productId);

    if (error) {
      toast({
        title: "Failed to remove from Wishlist",
        description: "There was a problem removing the item.",
      });
      setItems(items);
    } else {
      toast({
        title: "Removed from Wishlist",
        description: "Item successfully removed.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wishlist</CardTitle>
        <CardDescription>Items you've saved for later</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium">Your wishlist is empty</h3>
            <p className="text-gray-500 mt-2">Save items you love to your wishlist and find them here</p>
            <Link href={"/keyboards"}><Button className="mt-4">Start Shopping</Button></Link>
          </div>
        ) : (
          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                <Link href={`/keyboards/${item.id}`} className="flex items-start gap-4 flex-1">
                  <div className="flex-shrink-0">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  </div>
                  <div className="min-w-0">
                    <h5 className=" font-medium text-xs md:text-base">
                      {item.title?.length > 60
                        ? item.title.slice(0, 60) + "..."
                        : item.title}
                    </h5>
                    <div className="text-xs md:text-base font-medium mt-1">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </Link>
                <Button
                  onClick={() => handleDeleteBookmark(item.id)}
                  size="sm"
                  variant="ghost"
                  className="text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
