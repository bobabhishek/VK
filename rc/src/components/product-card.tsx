import Link from "next/link";
import { motion } from "framer-motion";
import { formatPrice } from "~/lib/utils";

export type Product = {
  id: string;
  title: string;
  price_cents: number;
  image_urls: string[] | null;
  category: string | null;
};

export function ProductCard({ p, index }: { p: Product; index?: number }) {
  const price = formatPrice(p.price_cents);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index ? index * 0.1 : 0 }}
    >
      <Link
        href={`/product/${p.id}`}
        className="group rounded-lg border p-3 hover:shadow-md focus:outline-none"
      >
        <div className="bg-muted aspect-square w-full overflow-hidden rounded-md">
          <img
            src={
              p.image_urls?.[0] ??
              "/placeholder.svg?height=600&width=600&query=streetwear%20product"
            }
            alt={p.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <h3 className="text-sm font-medium text-pretty">{p.title}</h3>
          <span className="text-sm font-semibold">{price}</span>
        </div>
        {p.category ? (
          <p className="text-muted-foreground mt-1 text-xs">{p.category}</p>
        ) : null}
      </Link>
    </motion.div>
  );
}
