"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

const categories = [
  {
    id: 1,
    title: "Keyboards",
    image: "https://i.postimg.cc/GhKCMSJN/keyboard.png",
    href: "/category/keyboards",
    size: "large",
  },
  {
    id: 2,
    title: "Keycaps",
    image: "https://i.postimg.cc/t4gH8tBg/keycaps.png",
    href: "/category/headphones",
    size: "medium",
  },
  {
    id: 3,
    title: "Switches",
    image: "https://i.postimg.cc/VLmwWcMn/switch.png",
    href: "/category/speakers",
    size: "small",
  },
  {
    id: 4,
    title: "Skadis Pegboards",
    image: "https://i.postimg.cc/sfpyW2B3/pegboard.png",
    href: "/category/accessories",
    size: "small",
  },
  {
    id: 5,
    title: "Desk mat",
    image: "/matt.png",
    href: "/category/monitors",
    size: "medium-wide",
  },
]

export default function CategoryBentoGrid() {
  // Reference to the section container
  const sectionRef = useRef<HTMLElement>(null)
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])
  const [scrollY, setScrollY] = useState(0)

  // Check if the section is in view
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  // Track scroll position for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll, { passive: true })

    // Clean up
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Apply parallax effect to images
  useEffect(() => {
    if (!sectionRef.current) return;

    const section = sectionRef.current;
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const windowHeight = window.innerHeight;

    const sectionStart = sectionTop - windowHeight;
    const sectionEnd = sectionTop + sectionHeight;

    if (scrollY < sectionStart || scrollY > sectionEnd) {
      imageRefs.current.forEach((imageRef, i) => {
        if (imageRef) imageRef.style.transform = i === 4 ? 'scale(2)' : 'translateY(0) scale(1)';
      });
      return;
    }

    const progress = (scrollY - sectionStart) / (sectionHeight + windowHeight);

    imageRefs.current.forEach((imageRef, index) => {
      if (!imageRef) return;

      const parallaxSpeed = 50 + (index % 2) * 20;
      const yOffset = -progress * parallaxSpeed;

      // Apply scale only to the third image (index 2)
      if (index === 2) {
        imageRef.style.transform = `translateY(${yOffset}px) scale(1.2)`;
      } else {
        imageRef.style.transform = `translateY(${yOffset}px) scale(1.1)`;
      }
    });
  }, [scrollY]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  const getCardClasses = (size: string) => {
    switch (size) {
      case "large":
        return "col-span-1 sm:col-span-2 row-span-1 sm:row-span-2"
      case "medium":
        return "col-span-1 row-span-1 sm:row-span-2"
      case "medium-wide":
        return "col-span-2 sm:col-span-4 row--span-1 md:row-span-2"
      case "small":
      default:
        return "col-span-1 row-span-1"
    }
  }

  return (
    <section className="w-full py-16 md:py-24 bg-background" ref={sectionRef}>
      <motion.div
        className="text-center mb-12"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={titleVariants}
      >
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Browse Categories</h2>
        <p className="mt-4 text-muted-foreground md:text-lg max-w-2xl mx-auto">
          Explore our curated collection of premium products
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[minmax(200px,auto)]"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            className={`${getCardClasses(category.size)} group relative overflow-hidden rounded-2xl bg-background border border-border/40 min-h-[180px]`}
            variants={cardVariants}
          >
            <Link href={category.href} className="block h-full w-full">
              <div className="relative h-full w-full overflow-hidden">
                {/* Image container with parallax effect */}
                <div
                  ref={(el) => {
                    imageRefs.current[index] = el;
                  }}
                  className="absolute inset-0 h-[115%] w-full transition-transform duration-700 ease-out"
                >
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.title}
                    className="object-cover h-full w-full"
                  />
                </div>

                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-70" />

                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <div className="flex justify-end">
                    <motion.div
                      className="bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                      whileHover={{ rotate: 45, scale: 1.1 }}
                    >
                      <ArrowUpRight className="h-4 w-4 text-black" />
                    </motion.div>
                  </div>

                  <div>
                    <h3 className="text-xl md:text-2xl font-medium text-white tracking-tight">{category.title}</h3>
                    <div className="h-0.5 w-0 bg-white mt-2 transition-all duration-300 group-hover:w-12" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

