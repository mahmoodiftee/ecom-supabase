'use client'
import { OpacityTransition } from "@/components/ui/Transitions";
import React, { useEffect, useRef, useState } from "react";

const CustomizationSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const ticking = useRef(false);
  const lastScrollY = useRef(0);

  // Responsive card style with dynamic height
  const getCardStyle = () => {
    const baseHeight = isMobile ? "30vh" : isTablet ? "55vh" : "60vh";
    const maxHeight = isMobile ? "400px" : isTablet ? "500px" : "600px";
    const borderRadius = isMobile ? "12px" : isTablet ? "16px" : "20px";

    return {
      width: "100%",
      height: baseHeight,
      maxHeight: maxHeight,
      borderRadius: borderRadius,
      transition:
        "transform 0.5s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.5s cubic-bezier(0.19, 1, 0.22, 1)",
      willChange: "transform, opacity",
    };
  };

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    // Create intersection observer to detect when section is in view
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1 } // Start observing when 10% of element is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Optimized scroll handler using requestAnimationFrame
    const handleScroll = () => {
      if (!ticking.current) {
        lastScrollY.current = window.scrollY;

        window.requestAnimationFrame(() => {
          if (!sectionRef.current) return;

          const sectionRect = sectionRef.current.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const totalScrollDistance = isMobile ? viewportHeight * 1.5 : viewportHeight * 2;

          // Calculate the scroll progress
          let progress = 0;
          if (sectionRect.top <= 0) {
            progress = Math.min(
              1,
              Math.max(0, Math.abs(sectionRect.top) / totalScrollDistance)
            );
          }

          // Determine which card should be visible based on progress
          if (progress >= 0.66) {
            setActiveCardIndex(2);
          } else if (progress >= 0.33) {
            setActiveCardIndex(1);
          } else {
            setActiveCardIndex(0);
          }

          ticking.current = false;
        });

        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isMobile]);

  // Card visibility based on active index instead of direct scroll progress
  const isFirstCardVisible = isIntersecting;
  const isSecondCardVisible = activeCardIndex >= 1;
  const isThirdCardVisible = activeCardIndex >= 2;

  // Responsive transform values
  const getTransformValues = (cardIndex: number, isVisible: boolean, isActive: boolean) => {
    if (!isVisible) return { translateY: isMobile ? "150px" : "200px", scale: 0.9 };

    const mobileValues = {
      0: { translateY: "60px", scale: 0.9 },
      1: { translateY: isActive ? "35px" : "30px", scale: 0.95 },
      2: { translateY: isActive ? "10px" : "5px", scale: 1 },
    };

    const tabletValues = {
      0: { translateY: "75px", scale: 0.9 },
      1: { translateY: isActive ? "45px" : "40px", scale: 0.95 },
      2: { translateY: isActive ? "12px" : "8px", scale: 1 },
    };

    const desktopValues = {
      0: { translateY: "90px", scale: 0.9 },
      1: { translateY: isActive ? "55px" : "45px", scale: 0.95 },
      2: { translateY: isActive ? "15px" : "0", scale: 1 },
    };

    if (isMobile) return mobileValues[cardIndex as keyof typeof mobileValues];
    if (isTablet) return tabletValues[cardIndex as keyof typeof tabletValues];
    return desktopValues[cardIndex as keyof typeof desktopValues];
  };

  const cardStyle = getCardStyle();

  return (
    <div ref={sectionRef} className="relative" style={{ height: isMobile ? "250vh" : isTablet ? "275vh" : "300vh" }}>
      <section
        className="w-full min-h-screen sticky overflow-hidden px-3 sm:px-4 md:px-0"
        style={{ top: isMobile ? "40px" : isTablet ? "50px" : "40px" }}
        id="customization"
      >
        <div className="h-full flex flex-col">
          <div className="mb-2 md:mb-3">
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2 md:mb-2 pt-6 sm:pt-5 md:pt-4">
              <div
                className="pulse-chip opacity-0 animate-fade-in text-xs sm:text-sm"
                style={{
                  animationDelay: "0.1s",
                }}
              >
                <span className="inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-pulse-500 text-white mr-2 text-xs">
                  02
                </span>
                <span>Customization</span>
              </div>
            </div>

            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-center px-2">
              <OpacityTransition>Build Your Dream Setup</OpacityTransition>
            </div>
          </div>

          <div
            ref={cardsContainerRef}
            className="relative flex-1 perspective-1000"
          >
            {/* First Card - Custom Keyboards */}
            <div
              className={`absolute inset-0 overflow-hidden shadow-lg sm:shadow-xl ${isFirstCardVisible ? "animate-card-enter" : ""}`}
              style={{
                ...cardStyle,
                zIndex: 10,
                transform: `translateY(${getTransformValues(0, isFirstCardVisible, false).translateY}) scale(${getTransformValues(0, isFirstCardVisible, false).scale})`,
                opacity: isFirstCardVisible ? 0.9 : 0,
              }}
            >
              <div
                className="absolute inset-0 z-0 bg-gradient-to-b from-pulse-900/40 to-dark-900/80"
                style={{
                  backgroundImage: "url('/background-section1.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "top center",
                  backgroundBlendMode: "overlay",
                }}
              ></div>

              <div className="relative z-10 p-4 sm:p-5 md:p-6 lg:p-8 h-full flex items-center">
                <div className="max-w-lg">
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display text-white font-bold leading-tight mb-3 sm:mb-4">
                    We Provide Verity of Mechanical Keyboards.
                  </h3>
                  <p className="hidden md:block text-sm sm:text-base text-white/80 leading-relaxed">
                    Choose your layout, switches, and keycaps to build a keyboard that's uniquely yours
                  </p>
                </div>
              </div>
            </div>

            {/* Second Card - Premium Switches */}
            <div
              className={`absolute inset-0 overflow-hidden shadow-lg sm:shadow-xl ${isSecondCardVisible ? "animate-card-enter" : ""}`}
              style={{
                ...cardStyle,
                zIndex: 20,
                transform: `translateY(${getTransformValues(1, isSecondCardVisible, activeCardIndex === 1).translateY}) scale(${getTransformValues(1, isSecondCardVisible, activeCardIndex === 1).scale})`,
                opacity: isSecondCardVisible ? 1 : 0,
                pointerEvents: isSecondCardVisible ? "auto" : "none",
              }}
            >
              <div
                className="absolute inset-0 z-0 bg-gradient-to-b from-pulse-900/40 to-dark-900/80"
                style={{
                  backgroundImage: "url('/background-section2.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundBlendMode: "overlay",
                }}
              ></div>

              <div className="relative z-10 p-4 sm:p-5 md:p-6 lg:p-8 h-full flex items-center">
                <div className="max-w-lg">
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display text-white font-bold leading-tight mb-3 sm:mb-4">
                    Premium Switches for Every Typing Style
                  </h3>
                  <p className="hidden md:block text-sm sm:text-base text-white/80 leading-relaxed">
                    From tactile to linear, clicky to silent - find the perfect feel for your fingers
                  </p>
                </div>
              </div>
            </div>

            {/* Third Card - Artisan Keycaps */}
            <div
              className={`absolute inset-0 overflow-hidden shadow-lg sm:shadow-xl ${isThirdCardVisible ? "animate-card-enter" : ""}`}
              style={{
                ...cardStyle,
                zIndex: 30,
                transform: `translateY(${getTransformValues(2, isThirdCardVisible, activeCardIndex === 2).translateY}) scale(${getTransformValues(2, isThirdCardVisible, activeCardIndex === 2).scale})`,
                opacity: isThirdCardVisible ? 1 : 0,
                pointerEvents: isThirdCardVisible ? "auto" : "none",
              }}
            >
              <div
                className="absolute inset-0 z-0 bg-gradient-to-b from-pulse-900/40 to-dark-900/80"
                style={{
                  backgroundImage: "url('/background-section3.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "bottom center",
                  backgroundBlendMode: "overlay",
                }}
              ></div>

              <div className="relative z-10 p-4 sm:p-5 md:p-6 lg:p-8 h-full flex items-center">
                <div className="max-w-lg">
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display text-white font-bold leading-tight mb-3 sm:mb-4">
                    Artisan Keycaps That Make a{" "}
                    <span className="text-[#FC4D0A]">Statement</span>
                  </h3>
                  <p className="hidden md:block text-sm sm:text-base text-white/80 leading-relaxed">
                    Express yourself with custom designs, premium materials, and stunning colorways
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CustomizationSection;