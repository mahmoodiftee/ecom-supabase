"use client";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps, inView, useInView } from "framer-motion";
import { useRef, useState } from "react";

interface SectionHeadingProps extends HTMLMotionProps<"h3"> {}
export const slideUp = {
  initial: {
    y: "100%",
  },
  open: (i: any) => ({
    y: "0%",
    transition: { duration: 0.5, delay: 0.01 * i },
  }),
};
export const SectionHeading = ({
  className,
  ...props
}: SectionHeadingProps) => {
  return (
    <motion.h3
      className={cn("text-4xl md:text-6xl font-semibold mx-auto", className)}
      {...props}
    />
  );
};

interface TextRevealProps {
  children: string;
  className?: string;
}
export const TextReveal = ({ children, className }: TextRevealProps) => {
  const [hover, setHover] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={cn("relative overflow-hidden whitespace-pre", className)}
    >
      <div className="overflow-hidden">
        {children.split("").map((char, i) => (
          <motion.span
            initial={{ y: 0 }}
            animate={{ y: hover ? "-100%" : 0 }}
            layout
            transition={{ delay: i * 0.02, ease: [0.215, 0.61, 0.355, 1] }}
            exit={{
              y: 0,
              transition: { delay: i * 0.02, ease: [0.215, 0.61, 0.355, 1] },
            }}
            key={i}
            className="inline-block whitespace-normal"
          >
            {char}
          </motion.span>
        ))}
      </div>
      <motion.div className="absolute left-0 top-0">
        {children.split("").map((char, i) => (
          <motion.span
            initial={{ y: "100%" }}
            animate={{ y: hover ? 0 : "100%" }}
            layout
            transition={{ delay: i * 0.02, ease: [0.215, 0.61, 0.355, 1] }}
            exit={{
              y: 0,
              transition: { delay: i * 0.02, ease: [0.215, 0.61, 0.355, 1] },
            }}
            key={i}
            className="inline-block whitespace-"
          >
            {char}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
};

export function PerspectiveText({
  children,
  hover,
}: {
  children: string;
  hover?: boolean;
}) {
  return (
    <motion.div className="relative overflow-hidden whitespace-pre">
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: hover ? "-100%" : 0 }}
        layout
        transition={{ delay: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
        className="py-2"
      >
        {children}
      </motion.div>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: hover ? 0 : "100%" }}
        layout
        transition={{  duration: 1,  delay: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
        className="absolute left-0 top-0 py-2"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

interface TextAnimationProps {
  className?: string;
  words: string;
  inView: boolean;
}

export const TextAnimation = ({
  className,
  words,
  inView,
}: TextAnimationProps) => {
  return (
    <motion.div className={cn("", className)}>
      {words.split(" ").map((word: string, index: number) => (
        <span key={index} className="relative overflow-hidden inline-flex pr-1">
          <motion.span
            variants={slideUp}
            custom={index}
            initial="initial"
            animate={inView ? "open" : "closed"}
            className=""
          >
            {word + "  "}
          </motion.span>
        </span>
      ))}
    </motion.div>
  );
};
