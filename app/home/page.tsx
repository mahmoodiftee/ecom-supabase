"use client";
import HumanoidSection from "./HomeComponents/CardStack/HumanoidSection";
import { ScrollingCards } from "./HomeComponents/FeatureStacking/ScrollingCards";
import Footer from "./HomeComponents/Footer/Footer";
import Hero from "./HomeComponents/Hero";

const HomePage = () => {

  return (
    <div>
      <Hero />
      <ScrollingCards />
      <HumanoidSection />
      <Footer />
    </div>
  );
};

export default HomePage;
