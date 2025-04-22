"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { SearchButton } from "../search";
import { CartIcon } from "../cart";
import { ThemeSwitcher } from "../theme-switcher";
import { Menu, X } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXTwitter,
  faFacebookF,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

interface NavLink {
  title: string;
  route: string;
}

interface MobileNavProps {
  navlinks: NavLink[];
}

export default function MobileNav({ navlinks }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close menu when route changes
  useEffect(() => {
    const handleRouteChange = () => setIsOpen(false);
    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);

  return (
    <div className="lg:hidden w-full mx-auto flex justify-between items-center pl-2 mt-4">
      <div className="relative z-50 flex items-center font-semibold">
        <Link href="/" className="text-xl font-bold">
          KEEBHOUS
        </Link>
      </div>
      <div className="w-full mx-auto flex justify-end items-center text-sm">
        <div className="flex justify-between items-center">
          <SearchButton />
          <CartIcon />
          <ThemeSwitcher />
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="relative z-50 w-10 h-10 flex items-center justify-center"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6 text-black dark:text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="w-6 h-6 text-black dark:text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-md"
            >
              <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="flex flex-col items-center justify-center h-full"
              >
                <ul className="flex flex-col items-center gap-8 text-2xl font-medium">
                  {navlinks.map((link, index) => (
                    <motion.li
                      key={link.route}
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 + index * 0.1, duration: 0.4 }}
                    >
                      <Link
                        href={link.route}
                        className="uppercase tracking-wider hover:text-primary transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {link.title}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
                <div className="mt-12 flex gap-6 text-black dark:text-white">
                  <Link
                    href="https://x.com"
                    target="_blank"
                    aria-label="X / Twitter"
                  >
                    <FontAwesomeIcon
                      icon={faXTwitter}
                      className="w-5 h-5 hover:text-primary transition-colors"
                    />
                  </Link>
                  <Link
                    href="https://facebook.com"
                    target="_blank"
                    aria-label="Facebook"
                  >
                    <FontAwesomeIcon
                      icon={faFacebookF}
                      className="w-5 h-5 hover:text-primary transition-colors"
                    />
                  </Link>
                  <Link
                    href="https://instagram.com"
                    target="_blank"
                    aria-label="Instagram"
                  >
                    <FontAwesomeIcon
                      icon={faInstagram}
                      className="w-5 h-5 hover:text-primary transition-colors"
                    />
                  </Link>
                </div>
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
