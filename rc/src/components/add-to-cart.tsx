"use client";

import { useState } from "react";
import { useCart } from "~/components/cart-store";
import { Button } from "~/components/ui/button";
import { motion } from "framer-motion";
import { useToast } from "~/hooks/use-toast";

export function AddToCart(props: {
  product_id: string;
  title: string;
  unit_price_cents: number;
  sizes: string[];
  image?: string;
}) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState<string | undefined>(props.sizes[0]);

  const handleAddToCart = () => {
    addItem({
      product_id: props.product_id,
      title: props.title,
      unit_price_cents: props.unit_price_cents,
      quantity: qty,
      size,
      image: props.image,
    });

    toast({
      title: "Added to cart",
      description: `${props.title} (${size}) x${qty} added to your cart`,
    });
  };

  return (
    <motion.div
      className="rounded-lg border p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <label className="block text-sm font-semibold">Size</label>
      <div className="mt-2 flex flex-wrap gap-2">
        {props.sizes.map((s) => (
          <Button
            key={s}
            type="button"
            onClick={() => setSize(s)}
            variant={size === s ? "default" : "outline"}
            size="sm"
          >
            {s}
          </Button>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <label className="text-sm">Qty</label>
        <input
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(Number.parseInt(e.target.value || "1"))}
          className="w-16 rounded-md border px-2 py-1 text-sm"
        />
      </div>

      <Button onClick={handleAddToCart} className="mt-4 w-full" variant="lime">
        Add to Cart
      </Button>
    </motion.div>
  );
}
