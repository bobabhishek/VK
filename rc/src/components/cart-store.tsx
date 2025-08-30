"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  product_id: string;
  title: string;
  unit_price_cents: number;
  quantity: number;
  size?: string;
  image?: string;
};

type CartStore = {
  items: CartItem[];
  totalCents: number;
  addItem: (item: CartItem) => void;
  removeItem: (product_id: string, size?: string) => void;
  updateQty: (
    product_id: string,
    size: string | undefined,
    qty: number,
  ) => void;
  clear: () => void;
};

export const useCart = create<CartStore>()(
  persist(
    (set, _get) => ({
      items: [],
      totalCents: 0,
      addItem: (item) =>
        set((state) => {
          const items = [...state.items];
          const idx = items.findIndex(
            (i) => i.product_id === item.product_id && i.size === item.size,
          );
          if (idx >= 0 && items[idx]) {
            items[idx].quantity += item.quantity;
          } else {
            items.push(item);
          }
          return {
            items,
            totalCents: items.reduce(
              (sum, i) => sum + i.unit_price_cents * i.quantity,
              0,
            ),
          };
        }),
      removeItem: (product_id, size) =>
        set((state) => {
          const items = state.items.filter(
            (i) => !(i.product_id === product_id && i.size === size),
          );
          return {
            items,
            totalCents: items.reduce(
              (sum, i) => sum + i.unit_price_cents * i.quantity,
              0,
            ),
          };
        }),
      updateQty: (product_id, size, qty) =>
        set((state) => {
          const items = [...state.items];
          const idx = items.findIndex(
            (i) => i.product_id === product_id && i.size === size,
          );
          if (idx >= 0 && items[idx]) items[idx].quantity = Math.max(1, qty);
          return {
            items,
            totalCents: items.reduce(
              (sum, i) => sum + i.unit_price_cents * i.quantity,
              0,
            ),
          };
        }),
      clear: () => set({ items: [], totalCents: 0 }),
    }),
    {
      name: "cart-storage",
    },
  ),
);
