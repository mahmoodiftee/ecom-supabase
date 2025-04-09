"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

const products = [
  {
    id: 1,
    name: "MG75W Bun Wonderland Wireless Mechanical Keyboard",
    image: "https://i.postimg.cc/d1w5HdP9/1.jpg",
    description: "75% Hot-Swappable Dual-Mode Gaming Keyboard with PBT Dye-Sub MOG Profile Keycaps (Akko V3 Piano Switch Switch)",
  },
  {
    id: 2,
    name: "Smart Watch",
    image: "https://i.postimg.cc/t4gH8tBg/keycaps.png",
    description: "Track your fitness and stay connected",
  },
  {
    id: 3,
    name: "Wireless Earbuds",
    image:
      "https://i.postimg.cc/GtJCnM04/Modern-Minimalist-Workspace-With-High-Contrast-Dramatic-Lighting.png",
    description: "Crystal clear audio with long battery life",
  },
  {
    id: 4,
    name: "Premium Headphones",
    image: "https://i.postimg.cc/GhKCMSJN/keyboard.png",
    description: "Immersive sound experience with noise cancellation",
  },
  {
    id: 5,
    name: "Smart Watch",
    image: "https://i.postimg.cc/t4gH8tBg/keycaps.png",
    description: "Track your fitness and stay connected",
  },
  {
    id: 6,
    name: "Wireless Earbuds",
    image:
      "https://i.postimg.cc/GtJCnM04/Modern-Minimalist-Workspace-With-High-Contrast-Dramatic-Lighting.png",
    description: "Crystal clear audio with long battery life",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const sliderVariants = {
    hidden: { x: 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
        delay: 0.4,
      },
    },
  };

  return (
    <section className="w-full relative overflow-hidden">
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
        <motion.div
          className="flex flex-col justify-center space-y-4 order-2 md:order-1"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="space-y-2">
            <motion.h1
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl"
              variants={itemVariants}
            >
              Discover Our Featured Products
            </motion.h1>
            <motion.p
              className="max-w-[600px] text-muted-foreground md:text-xl"
              variants={itemVariants}
            >
              Explore our collection of premium products designed to enhance
              your lifestyle with cutting-edge technology and elegant design.
            </motion.p>
          </div>
          <motion.div
            className="flex flex-col gap-2 min-[400px]:flex-row"
            variants={itemVariants}
          >
            <Button size="lg" asChild>
              <Link href="/explore">Explore</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">About</Link>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative overflow-hidden rounded-xl border bg-background shadow-lg md:order-2 order-1"
          initial="hidden"
          animate="visible"
          variants={sliderVariants}
        >
          <div className="relative aspect-square w-full max-h-[600px] overflow-hidden">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                  index === currentSlide
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                }`}
                initial={{
                  opacity: index === currentSlide ? 0 : 0,
                }}
                animate={{
                  opacity: index === currentSlide ? 1 : 0,
                }}
                transition={{ duration: 0.7 }}
              >
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <motion.div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black md:via-black/70 to-transparent p-6 md:py-20 text-white"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <h3 className="text-xl font-bold">{product.name}</h3>
                  <p className="mt-2 text-sm opacity-90">
                    {product.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Navigation buttons */}
          <motion.button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50 transition-colors"
            aria-label="Previous slide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="h-6 w-6" />
          </motion.button>
          <motion.button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50 transition-colors"
            aria-label="Next slide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="h-6 w-6" />
          </motion.button>

          {/* Slide indicators */}
          <motion.div
            className="absolute bottom-4 left-0 right-0 flex justify-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            {products.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentSlide ? "bg-white" : "bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
                whileHover={{ scale: 1.5 }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
