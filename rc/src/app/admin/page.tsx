"use client";

import Link from "next/link";
import { SiteHeader } from "~/components/site-header";
import { SiteFooter } from "~/components/site-footer";
import { motion } from "framer-motion";

export default function AdminHome() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <h1 className="text-2xl font-bold">Admin</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Manage products, customers, and orders.
        </p>
        <motion.div
          className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/admin/products"
            className="hover:bg-muted rounded-lg border p-4"
          >
            <h3 className="font-semibold">Products</h3>
            <p className="text-muted-foreground text-sm">Add, edit, delete</p>
          </Link>
          <Link
            href="/admin/orders"
            className="hover:bg-muted rounded-lg border p-4"
          >
            <h3 className="font-semibold">Orders</h3>
            <p className="text-muted-foreground text-sm">Contact customers</p>
          </Link>
          <Link
            href="/admin/customers"
            className="hover:bg-muted rounded-lg border p-4"
          >
            <h3 className="font-semibold">Customers</h3>
            <p className="text-muted-foreground text-sm">View registrations</p>
          </Link>
        </motion.div>
      </main>
      <SiteFooter />
    </div>
  );
}
