"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

const useScreenSize = () => {
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(false);

  useEffect(() => {
    // Function to check the screen size
    const checkScreenSize = () => {
      if (window.innerWidth >= 1024) {
        // Adjust this value to your threshold
        setIsLargeScreen(true);
      } else {
        setIsLargeScreen(false);
      }
    };

    // Check screen size on initial load
    checkScreenSize();

    // Add event listener to track window resize
    window.addEventListener("resize", checkScreenSize);

    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  return isLargeScreen;
};

const products = [
  {
    id: 1,
    name: "zFrontier TomatoCaps Error Keycap Set",
    image: "https://i.postimg.cc/L6C67fCT/ne-DEb-Lyr-QGOCb-T6-Qw-YLy-PC.jpg",
    description:
      "Dye-sublimated PBT (alpha keys), Doubleshot PBT/ABS (translucent orange keys) Compatible with Cherry MX switches and clones",
  },
  {
    id: 2,
    name: "WOBKEY Rainy75 Mechanical Keyboard",
    image:
      "https://i.postimg.cc/65NdqstS/X5-Xnp-YMh-SXq-PMkqexj-Os-standard-white.avif",
    description:
      "The WOBKEY Rainy75 Mechanical Keyboard is here to deliver just the right balance of “easy on your wallet” and “heavy on performance.”",
  },
  {
    id: 3,
    name: "Gazzew Boba U4T",
    image: "https://i.postimg.cc/Wzb3x7M2/u4t.webp",
    description: "62g / 68g 5 pin, through hole LED compat, tactile",
  },

  {
    id: 4,
    name: "Redfluid Gaming Mousepad",
    image:
      "https://i.postimg.cc/Hs6W85bM/mu-3-XL-redfluid-TU-mit-tasta-shop.webp",
    description:
      "propads high quality, smooth and durable. The surface is made of an exclusively woven polyester fabric. To prevent fraying, the mouse pad is reinforced with a sewn edging.",
  },
  {
    id: 5,
    name: "Skadis Pegboard",
    image:
      "https://i.postimg.cc/8CjS60TQ/skadis-pegboard-combination-black-1242045-pe920045-s5.webp",
    description:
      "A perfect way to get organised and keep smaller items close at hand anywhere in the home. Create your own combination of SKÅDIS pegboard and SKÅDIS accessories or choose this ready-made combination.",
  },
];

export default function Hero() {
  const isLargeScreen = useScreenSize();
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
    }, 15000);
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
  const keycapVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 0.25, // default mobile size
      transition: { duration: 0.8, ease: "easeOut", delay: 0.4 },
    },
  };

  const largeKeycapVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 0.17, // desktop size
      transition: { duration: 0.8, ease: "easeOut", delay: 0.4 },
    },
  };

  return (
    <section className="w-full relative overflow-hidden">
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center relative">
        <motion.img
          src="https://i.postimg.cc/JnC1ZCKD/switch.png"
          className="absolute -top-10 -left-[14%]"
          alt=""
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, scale: 0 },
            visible: {
              opacity: 0.2,
              scale: 0.5,
              rotate: -45,
              transition: { duration: 0.8, ease: "easeOut", delay: 0.2 },
            },
          }}
        />

        <motion.img
          src="https://i.postimg.cc/nhSH5sxq/keycaps.png"
          className="absolute md:-top-48 md:right-[17%] bottom-28 -right-10 rotate-45"
          alt=""
          initial="hidden"
          animate="visible"
          variants={isLargeScreen ? largeKeycapVariants : keycapVariants}
        />

        <motion.img
          src="https://i.postimg.cc/pT2nZhJz/keyboard.png"
          className="absolute bottom-6 md:-bottom-14 right-1/2"
          alt=""
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, scale: 0 },
            visible: {
              opacity: 0.2,
              scale: 0.5,
              transition: { duration: 0.8, ease: "easeOut", delay: 0.6 },
            },
          }}
        />

        <motion.div
          className="flex flex-col justify-center space-y-4 order-2 md:order-1"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="space-y-2">
            <motion.h1
              className="text-3xl font-bold tracking-tight md:leading-relaxed sm:text-4xl md:text-5xl lg:text-7xl"
              variants={itemVariants}
            >
              Discover Our <br /> Featured Products
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
              <Link href="/keyboards">Explore</Link>
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
                className={`absolute inset-0 group transition-opacity duration-500 ease-in-out ${
                  index === currentSlide
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: index === currentSlide ? 1 : 0 }}
                transition={{ duration: 0.7 }}
              >
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />

                <motion.div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 md:py-10 text-white translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
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
