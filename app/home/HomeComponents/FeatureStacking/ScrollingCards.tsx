"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import FeatureSection from "../FreatureSection/FeatureSection";
import Max from "@/components/max";
import { OpacityTransition } from "@/components/ui/Transitions";

const cardData = [
  {
    id: 1,
    images: [
      "https://i.postimg.cc/GhKCMSJN/keyboard.png",
      "https://i.postimg.cc/GhKCMSJN/keyboard.png",
      "https://i.postimg.cc/GhKCMSJN/keyboard.png",
      "https://i.postimg.cc/GhKCMSJN/keyboard.png",
    ],
    title: "Mechanical Keyboards",
    description:
      "Premium mechanical keyboards built for performance, durability, and style. Perfect for gamers, coders, and enthusiasts looking for the ultimate typing experience with quality builds and customizable layouts.",
  },
  {
    id: 2,
    images: [
      "https://i.postimg.cc/VLmwWcMn/switch.png",
      "https://i.postimg.cc/VLmwWcMn/switch.png",
      "https://i.postimg.cc/VLmwWcMn/switch.png",
      "https://i.postimg.cc/VLmwWcMn/switch.png",
    ],
    title: "Switches",
    description:
      "A wide range of mechanical switches, including tactile, linear, and clicky types. Choose the perfect feel and sound for your typing or gaming preferences—smooth, responsive, and built to last.",
  },
  {
    id: 3,
    images: [
      "https://i.postimg.cc/t4gH8tBg/keycaps.png",
      "https://i.postimg.cc/t4gH8tBg/keycaps.png",
      "https://i.postimg.cc/t4gH8tBg/keycaps.png",
      "https://i.postimg.cc/t4gH8tBg/keycaps.png",
    ],
    title: "Keycaps",
    description:
      "High-quality keycaps in various profiles, materials, and colors. Upgrade your keyboard’s look and feel with stylish designs that match your aesthetic and typing needs.",
  },
  {
    id: 4,
    images: [
      "https://i.postimg.cc/Hs6W85bM/mu-3-XL-redfluid-TU-mit-tasta-shop.webp",
      "https://i.postimg.cc/Hs6W85bM/mu-3-XL-redfluid-TU-mit-tasta-shop.webp",
      "https://i.postimg.cc/Hs6W85bM/mu-3-XL-redfluid-TU-mit-tasta-shop.webp",
      "https://i.postimg.cc/Hs6W85bM/mu-3-XL-redfluid-TU-mit-tasta-shop.webp",
    ],
    title: "Desk Mats",
    description:
      "Durable and smooth desk mats that add comfort and flair to your workspace. Made with stitched edges and anti-slip backing, ideal for daily use and full-desk coverage.",
  },
  {
    id: 5,
    images: [
      "https://i.postimg.cc/85zhRpWy/pegboard.png",
      "https://i.postimg.cc/85zhRpWy/pegboard.png",
      "https://i.postimg.cc/85zhRpWy/pegboard.png",
      "https://i.postimg.cc/85zhRpWy/pegboard.png",
    ],
    title: "Pegboards",
    description:
      "Functional and stylish pegboards designed for workspace organization. Hang cables, tools, or display your gear with ease—great for streamers and tech lovers alike.",
  },
];

export function ScrollingCards() {
  return (
    <div className="w-full">
      <Max>
        <div className="text-7xl font-extrabold text-center">
          <OpacityTransition>We Offer</OpacityTransition>
        </div>
        {cardData.map((card, index) => (
          <Card
            key={card.id}
            card={card}
            index={index}
            totalCards={cardData.length}
          />
        ))}
      </Max>
    </div>
  );
}

interface CardProps {
  card: {
    id: number;
    title: string;
    description: string;
    images: string[];
  };
  index: number;
  totalCards: number;
}

function Card({ card, index, totalCards }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const offsetTop = 20 + index * 20;

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(
    scrollYProgress,
    [0.3, 1],
    [1.05, index === totalCards - 1 ? 0.85 : 0.85]
  );

  return (
    <div
      ref={containerRef}
      className="sticky top-20"
      style={{
        paddingTop: `${offsetTop}px`,
        marginBottom: index === totalCards - 1 ? "250px" : "0",
        height: index === totalCards - 1 ? "500px" : "500px",
      }}
    >
      <motion.div
        ref={cardRef}
        className="flex overflow-hidden shadow-lg origin-top md:flex-row flex-col border border-[#eaeaea]
         dark:border-[#3f3f3f] bg-[#F2F2F2] dark:bg-[#2B2B2B] rounded-2xl my-6 p-6"
        style={{
          scale,
        }}
      >
        <FeatureSection
          section={card}
          position={index % 2 === 0 ? "right" : "left"}
        />
      </motion.div>
    </div>
  );
}
