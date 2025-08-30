"use client";

import { useState } from "react";
import { SiteHeader } from "~/components/site-header";
import { SiteFooter } from "~/components/site-footer";
import { ProductCard } from "~/components/product-card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import { Search, Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ShopPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: products = [] } = api.product.getAll.useQuery({
    query: isSearching ? query : undefined,
    category: category || undefined,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setIsFilterOpen(false);
  };

  // Common category options
  const categories = ["Hoodies", "T-Shirts", "Accessories", "Pants", "Hats"];

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {/* Mobile Filter Button */}
        <div className="mb-4 flex items-center justify-between md:hidden">
          <h1 className="text-xl font-bold">Shop</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-1"
          >
            {isFilterOpen ? (
              <>
                <X size={16} /> Close
              </>
            ) : (
              <>
                <Filter size={16} /> Filter
              </>
            )}
          </Button>
        </div>

        {/* Desktop Search Form */}
        <form
          onSubmit={handleSearch}
          className="mb-6 hidden grid-cols-1 gap-3 md:grid md:grid-cols-3"
        >
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full"
          />
          <Input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category (e.g., Hoodies)"
            className="w-full"
          />
          <Button
            type="submit"
            className="bg-black text-white hover:bg-gray-900"
          >
            Filter
          </Button>
        </form>

        {/* Mobile Filter Panel */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden md:hidden"
            >
              <form
                onSubmit={handleSearch}
                className="space-y-4 rounded-md border p-4"
              >
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Search
                  </label>
                  <div className="relative">
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search products..."
                      className="pl-9"
                    />
                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Categories
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <Button
                        key={cat}
                        type="button"
                        size="sm"
                        variant={category === cat ? "default" : "outline"}
                        onClick={() => setCategory(category === cat ? "" : cat)}
                        className="text-xs"
                      >
                        {cat}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-black text-white hover:bg-gray-900"
                >
                  Apply Filters
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.length > 0 ? (
            products.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)
          ) : (
            <div className="col-span-2 py-12 text-center md:col-span-3 lg:col-span-4">
              <p className="text-muted-foreground">
                No products found. Try adjusting your filters.
              </p>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
