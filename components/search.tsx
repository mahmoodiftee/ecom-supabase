"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SearchIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Search() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when search is opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) return;

    // Create new URLSearchParams
    const params = new URLSearchParams(searchParams);
    params.set("q", query);

    // Navigate to products page with search query
    router.push(`/products?${params.toString()}`);
  };

  const clearSearch = () => {
    setQuery("");
    inputRef.current?.focus();

    // Remove search param and navigate
    const params = new URLSearchParams(searchParams);
    params.delete("q");
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="relative">
      {isOpen ? (
        <form onSubmit={handleSearch} className="flex items-center">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="search"
              placeholder="Search products..."
              className="w-[200px] sm:w-[300px] pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-2.5 top-2.5"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="ml-2"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
        </form>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(true)}
          aria-label="Search"
        >
          <SearchIcon className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
