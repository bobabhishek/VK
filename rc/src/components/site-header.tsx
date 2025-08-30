"use client";

import Link from "next/link";
import { useCart } from "~/components/cart-store";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";

export function SiteHeader() {
  const { items } = useCart();
  const count = items.reduce((s, it) => s + it.quantity, 0);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Close mobile menu when navigating or resizing to desktop
  useEffect(() => {
    if (!isMobile) {
      setIsOpen(false);
    }
  }, [isMobile]);

  const nav = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/contact", label: "Contact" },
    { href: "/admin", label: "Admin" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link href="/" className="text-xl font-bold tracking-tight">
            STREET//LAB
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <motion.nav
          className="hidden items-center gap-6 md:flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-foreground/80 hover:text-foreground text-sm"
            >
              {n.label}
            </Link>
          ))}
          <Link href="/cart" className="relative text-sm font-medium">
            Cart
            <span className="ml-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-lime-500 px-2 text-xs font-bold text-black">
              {count}
            </span>
          </Link>
        </motion.nav>

        {/* Mobile Navigation Controls */}
        <div className="flex items-center gap-4 md:hidden">
          <Link href="/cart" className="relative" aria-label="Shopping Cart">
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-lime-500 px-1 text-xs font-bold text-black">
                {count}
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            className="p-1 focus:outline-none"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t bg-white md:hidden"
          >
            <nav className="flex flex-col p-4">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setIsOpen(false)}
                  className="text-foreground/80 hover:text-foreground border-b py-3 text-base last:border-0"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
