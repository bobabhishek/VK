"use client";

import Link from "next/link";
import { SiteHeader } from "~/components/site-header";
import { SiteFooter } from "~/components/site-footer";
import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b bg-black text-white">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <motion.h1
              className="text-4xl font-extrabold tracking-tight text-balance md:text-5xl"
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              STREET//LAB
            </motion.h1>
            <motion.p
              className="mt-4 max-w-xl text-sm leading-6 text-pretty text-gray-300"
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Urban-crafted essentials. Bold silhouettes. Premium comfort.
            </motion.p>
            <motion.div
              className="mt-6 flex items-center gap-3"
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button asChild variant="lime">
                <Link href="/shop">Shop Now</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Link href="/contact">Contact</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10">
          <motion.div
            className="grid grid-cols-1 gap-6 md:grid-cols-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <img
              src="/streetwear-editorial-1.png"
              alt="Streetwear Banner 1"
              className="w-full rounded-lg border"
            />
            <img
              src="/streetwear-editorial-2.png"
              alt="Streetwear Banner 2"
              className="w-full rounded-lg border"
            />
            <img
              src="/streetwear-editorial-3.png"
              alt="Streetwear Banner 3"
              className="w-full rounded-lg border"
            />
          </motion.div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
