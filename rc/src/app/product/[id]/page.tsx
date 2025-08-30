"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { SiteHeader } from "~/components/site-header";
import { SiteFooter } from "~/components/site-footer";
import { AddToCart } from "~/components/add-to-cart";
import { api } from "~/trpc/react";
import { formatPrice } from "~/lib/utils";
import { motion } from "framer-motion";
import { Truck, RefreshCw } from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: p, isLoading } = api.product.getById.useQuery({ id });

  if (isLoading) {
    return (
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />
        <main className="mx-auto max-w-6xl flex-1 px-4 py-12">
          <p>Loading product...</p>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (!p) {
    return (
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />
        <main className="mx-auto max-w-6xl flex-1 px-4 py-12">
          <p>Product not found.</p>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const price = formatPrice(p.price_cents);
  const images = p.image_urls?.length
    ? p.image_urls
    : ["/streetwear-product-detail.png"];

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:py-8">
        {/* Breadcrumb navigation for mobile - optional but helpful */}
        <div className="text-muted-foreground mb-4 flex items-center text-xs">
          <Link href="/">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/shop">Shop</Link>
          <span className="mx-2">›</span>
          <span className="max-w-[150px] truncate">{p.title}</span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {/* Product Images */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* First image larger */}
            <img
              src={images[0]}
              alt={p.title}
              className="aspect-square w-full rounded-lg border object-cover"
            />

            {/* Additional images as thumbnails on mobile, full-size on desktop */}
            {images.length > 1 && (
              <div className="mt-2 grid grid-cols-4 gap-2">
                {images.slice(1).map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`${p.title} - View ${i + 2}`}
                    className="aspect-square w-full rounded-lg border object-cover"
                  />
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, y: 20, x: 0 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col"
          >
            <h1 className="text-xl font-bold text-balance md:text-2xl">
              {p.title}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">{p.category}</p>
            <p className="mt-3 text-xl font-extrabold">{price}</p>

            {/* Add to Cart section sticks to bottom on mobile */}
            <div className="order-last mt-4 md:order-none md:mt-6">
              <AddToCart
                product_id={p.id}
                title={p.title}
                unit_price_cents={p.price_cents}
                sizes={p.sizes ?? ["S", "M", "L", "XL"]}
                image={images[0]}
              />
            </div>

            {/* Description */}
            <div className="prose prose-sm mt-6 max-w-none text-sm leading-6">
              <h2 className="mb-2 text-base font-medium">Product Details</h2>
              <p>{p.description}</p>
            </div>

            {/* Delivery info for mobile */}
            <div className="mt-6 border-t pt-4 md:hidden">
              <div className="flex items-center gap-2 text-sm">
                <Truck className="h-4 w-4" />
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <RefreshCw className="h-4 w-4" />
                <span>30-day returns</span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
