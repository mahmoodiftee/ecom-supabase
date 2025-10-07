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

// <div
// className="lg:w-1/3"
// >
// <div className={`flex flex-col space-y-6 mb-6`}>
//   <div className="text-3xl font-bold tracking-tight md:text-4xl">
//     <SectionHeading>Custom Keycaps</SectionHeading>
//   </div>
//   <p className="text-muted-foreground text-lg w-5/6">
//     Premium custom keycaps crafted for mechanical keyboard
//     enthusiasts. Choose from a variety of profiles and designs to
//     elevate your typing experience.
//   </p>
// </div>

// <div className="flex gap-4 mb-12">
//   <button
//     className={`w-12 h-12 rounded-lg shadow-md transition-all ${
//       activeKeycapSet === "gmk-botanical"
//         ? "ring-2 ring-purple-500 ring-offset-2"
//         : "opacity-70 hover:opacity-100"
//     }`}
//     onClick={() => setActiveKeycapSet("gmk-botanical")}
//     style={{
//       background: "linear-gradient(135deg, #9eb384 0%, #435334 100%)",
//     }}
//     aria-label="GMK Botanical"
//   />
//   <button
//     className={`w-12 h-12 rounded-lg shadow-md transition-all ${
//       activeKeycapSet === "gmk-laser"
//         ? "ring-2 ring-purple-500 ring-offset-2"
//         : "opacity-70 hover:opacity-100"
//     }`}
//     onClick={() => setActiveKeycapSet("gmk-laser")}
//     style={{
//       background: "linear-gradient(135deg, #ff71ce 0%, #01cdfe 100%)",
//     }}
//     aria-label="GMK Laser"
//   />
//   <button
//     className={`w-12 h-12 rounded-lg shadow-md transition-all ${
//       activeKeycapSet === "sa-bliss"
//         ? "ring-2 ring-purple-500 ring-offset-2"
//         : "opacity-70 hover:opacity-100"
//     }`}
//     onClick={() => setActiveKeycapSet("sa-bliss")}
//     style={{
//       background: "linear-gradient(135deg, #f9c5d1 0%, #9795ef 100%)",
//     }}
//     aria-label="SA Bliss"
//   />
// </div>

// <Link href="/keycaps">
//   <Button className="bg-purple-600 hover:bg-purple-700">
//     View All Keycaps <ArrowRight className="ml-2 h-4 w-4" />
//   </Button>
// </Link>
// </div>
