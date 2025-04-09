"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchIcon, X, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { useCart } from "@/context/cart-context";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Products } from "@/types/products";
import { Button } from "./ui/button";
import { DialogHeader } from "./ui/dialog";

interface SearchProps {
  keyboards: Products[]; // Define the keyboards prop
}

export function SearchButton() {
  const { isSearchOpen, setIsSearchOpen } = useCart();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setIsSearchOpen(!isSearchOpen)}
      aria-label="Search"
    >
      <SearchIcon className="h-6 w-6" />
    </Button>
  );
}

export function Search({ keyboards }: SearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Products[]>([]);
  const { isSearchOpen, setIsSearchOpen } = useCart();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    const filteredResults = keyboards.filter((keyboard) =>
      keyboard.title.toLowerCase().startsWith(value.toLowerCase())
    );

    setResults(filteredResults);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    inputRef.current?.focus();
  };

  const handleResultClick = (id: string) => {
    router.push(`/product-details/${id}`);
    setIsSearchOpen(false);
    setQuery("");
    setResults([]);
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40 bg-opacity-100"
            onClick={() => setIsSearchOpen(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <DialogContent className="bg-white dark:bg-background rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/2 p-6">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold mb-4 dark:text-white text-black">
                    Search Products
                  </DialogTitle>
                </DialogHeader>
                <div className="relative">
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Search..."
                    value={query}
                    onChange={handleSearch}
                    className="w-full pl-10 pr-4 py-2 bg-transparent dark:text-white text-black 
                  border-none outline-none ring-0 focus:ring-0 focus:border-none 
                  active:border-none !important"
                  />
                  <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                  {query && (
                    <X
                      className="absolute right-3 top-3 h-5 w-5 text-gray-500 dark:text-gray-400 cursor-pointer"
                      onClick={clearSearch}
                    />
                  )}
                </div>
                <div className="mt-4 max-h-96 overflow-y-auto">
                  {results.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center p-4 bg-gray-200/70 dark:bg-black/20  hover:bg-gray-200 dark:hover:bg-black/30 cursor-pointer rounded-lg group"
                      onClick={() => handleResultClick(product.id)}
                    >
                      <div className="w-20 h-20 relative hidden md:block">
                        <Image
                          src={product.image}
                          alt={product.title}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-lg"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="font-semibold dark:text-white text-black">
                          {product.title.slice(0, 50)}...
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {product.description.slice(0, 100)}...
                        </p>
                        <p className="text-sm font-bold dark:text-white text-black">
                          ${product.price}
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:text-white text-black" />
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
