"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const cardData = [
  {
    id: 1,
    title: "Card 1",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab dicta error nam eaque. Eum fuga laborum quos expedita iste saepe similique, unde possimus quia at magnam sed cupiditate? Reprehenderit, harum!",
    image:
      "https://images.unsplash.com/photo-1620207418302-439b387441b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=100",
  },
  {
    id: 2,
    title: "Card 2",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab dicta error nam eaque. Eum fuga laborum quos expedita iste saepe similique, unde possimus quia at magnam sed cupiditate? Reprehenderit, harum!",
    image:
      "https://images.unsplash.com/photo-1620207418302-439b387441b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=100",
  },
  {
    id: 3,
    title: "Card 3",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab dicta error nam eaque. Eum fuga laborum quos expedita iste saepe similique, unde possimus quia at magnam sed cupiditate? Reprehenderit, harum!",
    image:
      "https://images.unsplash.com/photo-1620207418302-439b387441b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=100",
  },
];

export function ScrollingCards() {
  return (
    <div className="w-full">
      {cardData.map((card, index) => (
        <Card
          key={card.id}
          card={card}
          index={index}
          totalCards={cardData.length}
        />
      ))}
    </div>
  );
}

interface CardProps {
  card: {
    id: number;
    title: string;
    description: string;
    image: string;
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

  // Scale from 1 to 0.9 for all cards except the last one
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, index === totalCards - 1 ? 0.9 : 0.85]
  );


  return (
    <div
      ref={containerRef}
      className="sticky top-20"
      style={{
        paddingTop: `${offsetTop}px`,
        marginBottom: "40px",
        height: index === totalCards - 1 ? "auto" : "500px",
      }}
    >
      <motion.div
        ref={cardRef}
        className="bg-white rounded-[14px] flex overflow-hidden shadow-lg origin-top md:flex-row flex-col"
        style={{
          scale,
        }}
      >
        <div className="md:w-2/5 w-full flex-shrink-0">
          <Image
            src={card.image || "/placeholder.svg"}
            alt=""
            width={400}
            height={400}
            className="w-full h-full object-cover md:aspect-square aspect-[16/9]"
          />
        </div>
        <div className="p-5 md:p-[30px_40px] flex flex-col">
          <h1 className="p-0 m-0 text-[32px] md:text-[60px] font-semibold text-[#16263a]">
            {card.title}
          </h1>
          <p className="leading-[1.4] text-base md:text-2xl text-[#16263a]">
            {card.description}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
