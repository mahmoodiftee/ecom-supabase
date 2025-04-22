"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SectionHeading } from "@/components/ui/Typography";

const CustomKeyscaps = () => {
  const [activeKeycapSet, setActiveKeycapSet] = useState("gmk-botanical");
  return (
    <section className="w-full p-6 rounded-2xl bg-foreground/5">
      <div className="flex flex-col lg:flex-row items-center gap-20">
        <div
          className="lg:w-1/3"
        >
          <div className={`flex flex-col space-y-6 mb-6`}>
            <div className="text-3xl font-bold tracking-tight md:text-4xl">
              <SectionHeading>Custom Keycaps</SectionHeading>
            </div>
            <p className="text-muted-foreground text-lg w-5/6">
              Premium custom keycaps crafted for mechanical keyboard
              enthusiasts. Choose from a variety of profiles and designs to
              elevate your typing experience.
            </p>
          </div>

          <div className="flex gap-4 mb-12">
            <button
              className={`w-12 h-12 rounded-lg shadow-md transition-all ${
                activeKeycapSet === "gmk-botanical"
                  ? "ring-2 ring-purple-500 ring-offset-2"
                  : "opacity-70 hover:opacity-100"
              }`}
              onClick={() => setActiveKeycapSet("gmk-botanical")}
              style={{
                background: "linear-gradient(135deg, #9eb384 0%, #435334 100%)",
              }}
              aria-label="GMK Botanical"
            />
            <button
              className={`w-12 h-12 rounded-lg shadow-md transition-all ${
                activeKeycapSet === "gmk-laser"
                  ? "ring-2 ring-purple-500 ring-offset-2"
                  : "opacity-70 hover:opacity-100"
              }`}
              onClick={() => setActiveKeycapSet("gmk-laser")}
              style={{
                background: "linear-gradient(135deg, #ff71ce 0%, #01cdfe 100%)",
              }}
              aria-label="GMK Laser"
            />
            <button
              className={`w-12 h-12 rounded-lg shadow-md transition-all ${
                activeKeycapSet === "sa-bliss"
                  ? "ring-2 ring-purple-500 ring-offset-2"
                  : "opacity-70 hover:opacity-100"
              }`}
              onClick={() => setActiveKeycapSet("sa-bliss")}
              style={{
                background: "linear-gradient(135deg, #f9c5d1 0%, #9795ef 100%)",
              }}
              aria-label="SA Bliss"
            />
          </div>

          <Link href="/keycaps">
            <Button className="bg-purple-600 hover:bg-purple-700">
              View All Keycaps <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Right side - Mechanical Keyboard Visualization */}
        <motion.div
          className="lg:w-2/3"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Mechanical Keyboard Case */}
          <div className="relative mx-auto" style={{ maxWidth: "800px" }}>
            {/* Keyboard Case with Beveled Edges */}
            <motion.div
              className="relative rounded-xl overflow-hidden"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              {/* Keyboard Case */}
              <div
                className="relative w-full pt-[50%] rounded-xl shadow-2xl"
                style={{
                  background:
                    activeKeycapSet === "gmk-botanical"
                      ? "linear-gradient(145deg, #2d3a24, #1a2213)"
                      : activeKeycapSet === "gmk-laser"
                        ? "linear-gradient(145deg, #2b213a, #1a1022)"
                        : "linear-gradient(145deg, #e0d6d6, #c9b5b5)",
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              >
                {/* RGB Light Strip Effect */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1"
                  style={{
                    backgroundImage:
                      activeKeycapSet === "gmk-botanical"
                        ? "linear-gradient(90deg, #9eb384, #435334, #9eb384)"
                        : activeKeycapSet === "gmk-laser"
                          ? "linear-gradient(90deg, #ff71ce, #01cdfe, #ff71ce)"
                          : "linear-gradient(90deg, #f9c5d1, #9795ef, #f9c5d1)",
                    backgroundSize: "200% 100%",
                  }}
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />

                {/* Keyboard Plate */}
                <div className="absolute top-[5%] left-[3%] right-[3%] bottom-[10%] rounded-lg bg-black bg-opacity-80">
                  {/* Keycaps Grid - 65% Layout with proper spacing */}
                  <div className="absolute inset-[3%] grid grid-cols-15 grid-rows-5 gap-[4px]">
                    {/* Generate keycaps based on active set */}
                    {Array.from({ length: 15 * 5 }).map((_, index) => {
                      // Calculate row and column
                      const row = Math.floor(index / 15);
                      const col = index % 15;

                      // Skip positions where there are no keycaps in a 65% layout
                      if (
                        (row === 0 && col > 13) || // No keys after Backspace
                        (row === 1 && col > 13) || // No keys after Delete
                        (row === 2 && col > 13) || // No keys after Page Up
                        (row === 3 && col > 12) || // No keys after Page Down
                        (row === 4 && col > 13) || // No keys after Right Arrow
                        // Gaps in bottom row for spacebar
                        (row === 4 && col > 0 && col < 3) ||
                        (row === 4 && col > 3 && col < 9) ||
                        (row === 4 && col > 9 && col < 11)
                      ) {
                        return null;
                      }

                      // Special width for certain keys
                      let colSpan = 1;

                      // Backspace key
                      if (row === 0 && col === 13) colSpan = 2;
                      // Tab key
                      if (row === 1 && col === 0) colSpan = 1.5;
                      // Backslash key
                      if (row === 1 && col === 13) colSpan = 1.5;
                      // Caps Lock
                      if (row === 2 && col === 0) colSpan = 1.75;
                      // Enter key
                      if (row === 2 && col === 12) colSpan = 2.25;
                      // Left Shift
                      if (row === 3 && col === 0) colSpan = 2.25;
                      // Right Shift
                      if (row === 3 && col === 11) colSpan = 1.75;
                      // Bottom row modifiers
                      if (row === 4 && col === 0) colSpan = 1.25; // Left Ctrl
                      if (row === 4 && col === 3) colSpan = 6.25; // Spacebar
                      if (row === 4 && col === 9) colSpan = 1.25; // Right Alt

                      // Determine keycap colors based on active set
                      let keycapBg, keycapText;

                      if (activeKeycapSet === "gmk-botanical") {
                        // GMK Botanical colors
                        keycapBg =
                          row === 0 ||
                          col === 0 ||
                          col === 13 ||
                          col === 14 ||
                          row === 4
                            ? "#435334" // Accent color for modifiers
                            : "#9eb384"; // Base color for alphas
                        keycapText = "#e5e1d4"; // Legend color
                      } else if (activeKeycapSet === "gmk-laser") {
                        // GMK Laser colors
                        keycapBg =
                          row === 0 ||
                          col === 0 ||
                          col === 13 ||
                          col === 14 ||
                          row === 4
                            ? "#b000ff" // Accent color for modifiers
                            : "#0b0a29"; // Base color for alphas
                        keycapText = "#00eeff"; // Legend color
                      } else if (activeKeycapSet === "sa-bliss") {
                        // SA Bliss colors
                        keycapBg =
                          row === 0 ||
                          col === 0 ||
                          col === 13 ||
                          col === 14 ||
                          row === 4
                            ? "#f9c5d1" // Accent color for modifiers
                            : "#f0e6e6"; // Base color for alphas
                        keycapText = "#8e6a75"; // Legend color
                      }

                      // Determine keycap text based on position
                      let keycapLabel = "";

                      // Row 1 (number row)
                      if (row === 0) {
                        if (col === 0) keycapLabel = "ESC";
                        else if (col === 13) keycapLabel = "⌫";
                      }
                      // Row 2 (QWERTY row)
                      else if (row === 1) {
                        if (col === 0) keycapLabel = "TAB";
                        else if (col === 13) keycapLabel = "DEL";
                      }
                      // Row 3 (ASDF row)
                      else if (row === 2) {
                        if (col === 0) keycapLabel = "CAPS";
                        else if (col === 12) keycapLabel = "ENTER";
                      }
                      // Row 4 (ZXCV row)
                      else if (row === 3) {
                        if (col === 0) keycapLabel = "SHIFT";
                        else if (col === 11) keycapLabel = "SHIFT";
                      }
                      // Row 5 (bottom row)
                      else if (row === 4) {
                        if (col === 0) keycapLabel = "CTRL";
                        else if (col === 3)
                          keycapLabel = ""; // Spacebar
                        else if (col === 9) keycapLabel = "ALT";
                        else if (col === 11) keycapLabel = "←";
                        else if (col === 12) keycapLabel = "↓";
                        else if (col === 13) keycapLabel = "→";
                      }

                      // Alpha keys (simplified)
                      if (row === 1 && col >= 1 && col <= 10) {
                        const qwertyRow = [
                          "Q",
                          "W",
                          "E",
                          "R",
                          "T",
                          "Y",
                          "U",
                          "I",
                          "O",
                          "P",
                        ];
                        keycapLabel = qwertyRow[col - 1];
                      } else if (row === 2 && col >= 1 && col <= 9) {
                        const asdRow = [
                          "A",
                          "S",
                          "D",
                          "F",
                          "G",
                          "H",
                          "J",
                          "K",
                          "L",
                        ];
                        keycapLabel = asdRow[col - 1];
                      } else if (row === 3 && col >= 2 && col <= 8) {
                        const zxcRow = ["Z", "X", "C", "V", "B", "N", "M"];
                        keycapLabel = zxcRow[col - 2];
                      }

                      // Create 3D keycap effect
                      return (
                        <motion.div
                          key={`keycap-${row}-${col}`}
                          className="relative"
                          style={{
                            gridColumn: `span ${colSpan}`,
                            height:
                              activeKeycapSet === "sa-bliss"
                                ? `${3 - Math.abs(2 - row) * 0.5}rem` // SA profile has different heights per row
                                : "2.5rem",
                          }}
                          initial={{ y: 30, opacity: 0 }}
                          whileInView={{
                            y: 0,
                            opacity: 1,
                            transition: {
                              delay: 0.01 * (row * 15 + col),
                              duration: 0.3,
                              type: "spring",
                              stiffness: 300,
                            },
                          }}
                          viewport={{ once: true }}
                        >
                          {/* Keycap Side/Depth */}
                          <div
                            className="absolute inset-0 rounded-md"
                            style={{
                              backgroundColor: keycapBg
                                ? keycapBg.replace("#", "#")
                                : "#333",
                              filter: "brightness(0.7)",
                              transform: "translateY(2px)",
                            }}
                          />

                          {/* Keycap Top Surface */}
                          <motion.div
                            className="absolute inset-0 rounded-md flex items-center justify-center"
                            style={{
                              backgroundColor: keycapBg,
                              color: keycapText,
                              fontSize:
                                keycapLabel.length > 1 ? "0.6rem" : "0.8rem",
                              fontWeight: "bold",
                              boxShadow:
                                "0 2px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
                              border: "1px solid rgba(0,0,0,0.1)",
                              transform:
                                activeKeycapSet === "sa-bliss"
                                  ? `translateY(-2px) perspective(100px) rotateX(${10 - row * 5}deg)`
                                  : "translateY(-2px)",
                            }}
                            whileHover={{
                              y: -6,
                              boxShadow:
                                "0 8px 15px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
                              transition: { duration: 0.2 },
                            }}
                          >
                            {keycapLabel}
                          </motion.div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Keycap Set Name - Minimal */}
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold">
                {activeKeycapSet === "gmk-botanical"
                  ? "GMK Botanical"
                  : activeKeycapSet === "gmk-laser"
                    ? "GMK Laser"
                    : "SA Bliss"}
              </h3>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CustomKeyscaps;
