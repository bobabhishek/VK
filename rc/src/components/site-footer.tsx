"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type FooterSectionProps = {
  title: string;
  children: React.ReactNode;
  mobileCollapsible?: boolean;
};

function FooterSection({
  title,
  children,
  mobileCollapsible = true,
}: FooterSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="py-4 md:py-0">
      <div
        className={`flex items-center justify-between ${mobileCollapsible ? "cursor-pointer md:cursor-default" : ""}`}
        onClick={mobileCollapsible ? () => setIsOpen(!isOpen) : undefined}
      >
        <h3 className="text-sm font-semibold">{title}</h3>
        {mobileCollapsible && (
          <button
            className="p-1 md:hidden"
            aria-label={isOpen ? "Collapse" : "Expand"}
          >
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}
      </div>
      <div
        className={`mt-3 space-y-2 ${mobileCollapsible ? (isOpen ? "block" : "hidden md:block") : "block"}`}
      >
        {children}
      </div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-background border-t">
      <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 gap-0 divide-y md:grid-cols-2 md:gap-8 md:divide-y-0 lg:grid-cols-4">
          <FooterSection title="Shop">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/shop"
                  className="text-muted-foreground hover:text-foreground text-xs"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=Hoodies"
                  className="text-muted-foreground hover:text-foreground text-xs"
                >
                  Hoodies
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=T-Shirts"
                  className="text-muted-foreground hover:text-foreground text-xs"
                >
                  T-Shirts
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=Accessories"
                  className="text-muted-foreground hover:text-foreground text-xs"
                >
                  Accessories
                </Link>
              </li>
            </ul>
          </FooterSection>

          <FooterSection title="Support">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground text-xs"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-muted-foreground hover:text-foreground text-xs"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-muted-foreground hover:text-foreground text-xs"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-muted-foreground hover:text-foreground text-xs"
                >
                  Returns & Exchanges
                </Link>
              </li>
            </ul>
          </FooterSection>

          <FooterSection title="Legal">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-foreground text-xs"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-foreground text-xs"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </FooterSection>

          <FooterSection title="About" mobileCollapsible={false}>
            <p className="text-muted-foreground text-xs">
              STREET//LAB is a cutting-edge streetwear brand for fashion-forward
              individuals who appreciate urban aesthetics with premium comfort.
            </p>
          </FooterSection>
        </div>

        <div className="mt-8 border-t pt-6">
          <p className="text-muted-foreground text-center text-xs">
            © {new Date().getFullYear()} STREET//LAB. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
