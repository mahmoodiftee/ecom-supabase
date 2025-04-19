import CategoryBentoGrid from "./HomeComponents/Category";
import { ScrollingCards } from "./HomeComponents/FeatureStacking/page";
import FeatureSection from "./HomeComponents/FreatureSection/page";
import Hero from "./HomeComponents/Hero";

const Keyboards = {
  images: [
    "https://i.postimg.cc/GhKCMSJN/keyboard.png",
    "https://i.postimg.cc/GhKCMSJN/keyboard.png",
    "https://i.postimg.cc/GhKCMSJN/keyboard.png",
    "https://i.postimg.cc/GhKCMSJN/keyboard.png",
  ],
  title: "Mechanical Keyboards",
  description:
    "Premium mechanical keyboards built for performance, durability, and style. Perfect for gamers, coders, and enthusiasts looking for the ultimate typing experience with quality builds and customizable layouts.",
};
const Switches = {
  images: [
    "https://i.postimg.cc/VLmwWcMn/switch.png",
    "https://i.postimg.cc/VLmwWcMn/switch.png",
    "https://i.postimg.cc/VLmwWcMn/switch.png",
    "https://i.postimg.cc/VLmwWcMn/switch.png",
  ],
  title: "Switches",
  description:
    "A wide range of mechanical switches, including tactile, linear, and clicky types. Choose the perfect feel and sound for your typing or gaming preferences—smooth, responsive, and built to last.",
};

const Keycaps = {
  images: [
    "https://i.postimg.cc/t4gH8tBg/keycaps.png",
    "https://i.postimg.cc/t4gH8tBg/keycaps.png",
    "https://i.postimg.cc/t4gH8tBg/keycaps.png",
    "https://i.postimg.cc/t4gH8tBg/keycaps.png",
  ],
  title: "Keycaps",
  description:
    "High-quality keycaps in various profiles, materials, and colors. Upgrade your keyboard’s look and feel with stylish designs that match your aesthetic and typing needs.",
};

const DeskMat = {
  images: [
    "https://i.postimg.cc/Hs6W85bM/mu-3-XL-redfluid-TU-mit-tasta-shop.webp",
    "https://i.postimg.cc/Hs6W85bM/mu-3-XL-redfluid-TU-mit-tasta-shop.webp",
    "https://i.postimg.cc/Hs6W85bM/mu-3-XL-redfluid-TU-mit-tasta-shop.webp",
    "https://i.postimg.cc/Hs6W85bM/mu-3-XL-redfluid-TU-mit-tasta-shop.webp",
  ],
  title: "Desk Mats",
  description:
    "Durable and smooth desk mats that add comfort and flair to your workspace. Made with stitched edges and anti-slip backing, ideal for daily use and full-desk coverage.",
};

const Pegboards = {
  images: [
    "https://i.postimg.cc/85zhRpWy/pegboard.png",
    "https://i.postimg.cc/85zhRpWy/pegboard.png",
    "https://i.postimg.cc/85zhRpWy/pegboard.png",
    "https://i.postimg.cc/85zhRpWy/pegboard.png",
  ],
  title: "Pegboards",
  description:
    "Functional and stylish pegboards designed for workspace organization. Hang cables, tools, or display your gear with ease—great for streamers and tech lovers alike.",
};

const HomePage = () => {
  return (
    <section>
      <Hero />
      {/* <CategoryBentoGrid /> */}
      <ScrollingCards />
      <FeatureSection section={Keyboards} position="left" />
      <FeatureSection section={Switches} position="right" />
      {/* <FeatureSection section={Keycaps} position="left" />
      <FeatureSection section={Pegboards} position="right" />
      <FeatureSection section={DeskMat} position="left" /> */}
    </section>
  );
};

export default HomePage;
