"use client";

import Link from "next/link";
import { SiteHeader } from "~/components/site-header";
import { SiteFooter } from "~/components/site-footer";
import { useCart } from "~/components/cart-store";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import { formatPrice } from "~/lib/utils";
import { useToast } from "~/hooks/use-toast";
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export default function CartPage() {
  const { items, removeItem, updateQty, totalCents, clear } = useCart();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [phone, setPhone] = useState<string>("");
  const [name, setName] = useState<string>("");

  const createOrder = api.order.create.useMutation({
    onSuccess: () => {
      clear();
      toast({
        title: "Order placed!",
        description: "Admin will contact you soon.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  async function checkout() {
    if (!items.length) return;
    if (!name) {
      toast({
        title: "Name required",
        description: "Please provide your name",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      await createOrder.mutateAsync({
        items,
        customer_name: name,
        customer_phone: phone,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:py-8">
        <h1 className="text-xl font-bold md:text-2xl">Your Cart</h1>
        {!items.length ? (
          <div className="mt-8 py-12 text-center">
            <ShoppingCart className="text-muted-foreground/50 mx-auto mb-4 h-12 w-12" />
            <p className="text-muted-foreground mb-6 text-sm">
              Your cart is empty.
            </p>
            <Button asChild variant="outline">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Order Summary - Shows at top on mobile, moves to sidebar on desktop */}
            <div className="bg-muted/10 mt-4 mb-6 rounded-md border p-4 lg:hidden">
              <div className="flex justify-between">
                <p className="text-sm">
                  Subtotal ({items.length} item{items.length !== 1 ? "s" : ""})
                </p>
                <p className="font-semibold">{formatPrice(totalCents)}</p>
              </div>
              <Button
                onClick={checkout}
                className="mt-3 w-full"
                variant="lime"
                disabled={submitting}
              >
                {submitting ? "Processing..." : "Proceed to Checkout"}
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
              <div className="space-y-4 lg:col-span-2">
                {items.map((it, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex flex-col items-start gap-3 rounded-md border p-3 sm:flex-row sm:items-center sm:gap-4"
                  >
                    <div className="flex w-full items-center gap-3 sm:w-auto">
                      <img
                        src={
                          it.image ??
                          "/placeholder.svg?height=200&width=200&query=cart%20item"
                        }
                        alt={it.title}
                        className="h-16 w-16 rounded-md object-cover sm:h-20 sm:w-20"
                      />
                      <div className="flex-1 sm:hidden">
                        <p className="text-sm font-semibold">{it.title}</p>
                        <p className="text-muted-foreground text-xs">
                          {it.size}
                        </p>
                        <p className="mt-1 text-sm font-semibold">
                          {formatPrice(it.unit_price_cents)}
                        </p>
                      </div>
                    </div>

                    <div className="hidden flex-1 sm:block">
                      <p className="text-sm font-semibold">{it.title}</p>
                      <p className="text-muted-foreground text-xs">{it.size}</p>
                      <p className="text-muted-foreground mt-1 hidden text-sm sm:block">
                        {formatPrice(it.unit_price_cents)} each
                      </p>
                    </div>

                    <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-start">
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQty(
                              it.product_id,
                              it.size,
                              Math.max(1, it.quantity - 1),
                            )
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          min={1}
                          value={it.quantity}
                          onChange={(e) =>
                            updateQty(
                              it.product_id,
                              it.size,
                              Number.parseInt(e.target.value || "1"),
                            )
                          }
                          className="h-8 w-14 text-center"
                        />
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQty(it.product_id, it.size, it.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-3">
                        <p className="text-sm font-semibold whitespace-nowrap">
                          {formatPrice(it.unit_price_cents * it.quantity)}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive h-8 w-8"
                          onClick={() => removeItem(it.product_id, it.size)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Checkout form */}
              <div className="hidden lg:block">
                <div className="sticky top-20 rounded-md border p-4">
                  <p className="text-sm font-medium">Order Summary</p>
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Subtotal</p>
                      <p>{formatPrice(totalCents)}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Shipping</p>
                      <p>Free</p>
                    </div>
                    <div className="my-3 flex justify-between border-t pt-3">
                      <p className="font-medium">Total</p>
                      <p className="font-bold">{formatPrice(totalCents)}</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <Input
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <Input
                      placeholder="Phone (for admin call/WhatsApp)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />

                    <Button
                      onClick={checkout}
                      className="w-full"
                      variant="lime"
                      disabled={submitting}
                    >
                      {submitting ? "Processing..." : "Place Order"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Checkout Section - Fixed at bottom */}
            <div className="bg-background sticky bottom-0 mt-6 border-t px-4 py-4 lg:hidden">
              <div className="space-y-3">
                <Input
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  placeholder="Phone (for admin call/WhatsApp)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <Button
                  onClick={checkout}
                  className="w-full"
                  variant="lime"
                  disabled={submitting}
                >
                  {submitting
                    ? "Processing..."
                    : `Checkout • ${formatPrice(totalCents)}`}
                </Button>
              </div>
            </div>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
