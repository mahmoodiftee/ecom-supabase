"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface SectionProps {
  images: string[];
  title: string;
  description: string;
}

interface FeatureSectionProps {
  section: SectionProps;
  position: "left" | "right";
}

export default function FeatureSection({
  section,
  position,
}: FeatureSectionProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);
  const transitionTime = 4000;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Track if we've animated in
  useEffect(() => {
    if (isInView && !hasAnimatedIn) {
      setHasAnimatedIn(true);
    }
  }, [isInView, hasAnimatedIn]);

  const nextImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % section.images.length
    );
    setProgress(0);
  };

  const animateProgress = (timestamp: number) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = timestamp;
    }

    const elapsed = timestamp - lastTimeRef.current;
    const newProgress = Math.min((elapsed / transitionTime) * 100, 100);
    setProgress(newProgress);

    if (newProgress < 100) {
      animationRef.current = requestAnimationFrame(animateProgress);
    }
  };

  // Handle the auto-rotation of images
  useEffect(() => {
    if (!isInView) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    lastTimeRef.current = null;
    animationRef.current = requestAnimationFrame(animateProgress);
    intervalRef.current = setInterval(nextImage, transitionTime);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [currentImageIndex, isInView]);

  // Determine the order based on position prop
  const contentOrder = position === "left" ? "md:order-1" : "md:order-2";
  const imageOrder = position === "left" ? "md:order-2" : "md:order-1";

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={hasAnimatedIn ? "visible" : "hidden"}
      variants={containerVariants}
      className="w-full min-h-screen flex flex-col justify-center"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div
            className={`relative h-[500px] overflow-hidden rounded-lg shadow-lg ${imageOrder}`}
          >
            <AnimatePresence mode="popLayout">
              <motion.div
                key={currentImageIndex}
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{
                  duration: 0.7,
                  ease: "linear",
                }}
                className="absolute inset-0 w-full h-full"
              >
                <img
                  src={section.images[currentImageIndex] || "/placeholder.svg"}
                  alt={`Slide ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
              {section.images.map((_, index) => (
                <div key={index} className="flex items-center">
                  {index === currentImageIndex ? (
                    <motion.div
                      className="h-2 bg-primary rounded-full"
                      initial={{ width: 8 }}
                      animate={{ width: 60 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      <motion.div
                        className="h-full bg-white rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      className="h-2 w-2 bg-white/70 rounded-full"
                      initial={{
                        width:
                          index ===
                          (currentImageIndex - 1 + section.images.length) %
                            section.images.length
                            ? 60
                            : 8,
                      }}
                      animate={{ width: 8 }}
                      transition={{ duration: 0.3, ease: "easeIn" }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className={`flex flex-col space-y-6 ${contentOrder}`}>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              {section.title}
            </h2>
            <p className="text-muted-foreground text-lg">
              {section.description}
            </p>
            <div>
              <Button size="lg" className="mt-2">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
