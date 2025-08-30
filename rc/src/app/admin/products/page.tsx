"use client";

import { SiteHeader } from "~/components/site-header";
import { SiteFooter } from "~/components/site-footer";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import { useToast } from "~/hooks/use-toast";
import { formatPrice } from "~/lib/utils";

export default function AdminProducts() {
  const { toast } = useToast();
  const utils = api.useUtils();

  const { data = [] } = api.product.getAll.useQuery({});

  const [form, setForm] = useState({
    title: "",
    price_cents: 0,
    image_urls: "",
    category: "",
    sizes: "S,M,L,XL",
    stock: 0,
    description: "",
  });
  const [saving, setSaving] = useState(false);

  const createProduct = api.product.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product created successfully",
      });
      setForm({
        title: "",
        price_cents: 0,
        image_urls: "",
        category: "",
        sizes: "S,M,L,XL",
        stock: 0,
        description: "",
      });
      void utils.product.getAll.invalidate();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteProduct = api.product.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      void utils.product.getAll.invalidate();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title: form.title,
      price_cents: Number(form.price_cents),
      image_urls: form.image_urls
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      category: form.category || undefined,
      sizes: form.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      stock: Number(form.stock),
      description: form.description,
    };

    try {
      await createProduct.mutateAsync(payload);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete product?")) return;
    await deleteProduct.mutateAsync({ id });
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <h1 className="text-2xl font-bold">Products</h1>

        <form
          onSubmit={handleSubmit}
          className="mt-6 grid grid-cols-1 gap-3 rounded-md border p-4 md:grid-cols-2"
        >
          <Input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
          />
          <Input
            type="number"
            placeholder="Price (cents)"
            value={form.price_cents}
            onChange={(e) =>
              setForm((f) => ({ ...f, price_cents: Number(e.target.value) }))
            }
            required
          />
          <Input
            placeholder="Image URLs (comma separated)"
            value={form.image_urls}
            onChange={(e) =>
              setForm((f) => ({ ...f, image_urls: e.target.value }))
            }
            className="md:col-span-2"
          />
          <Input
            placeholder="Category"
            value={form.category}
            onChange={(e) =>
              setForm((f) => ({ ...f, category: e.target.value }))
            }
          />
          <Input
            placeholder="Sizes (comma separated)"
            value={form.sizes}
            onChange={(e) => setForm((f) => ({ ...f, sizes: e.target.value }))}
          />
          <Input
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) =>
              setForm((f) => ({ ...f, stock: Number(e.target.value) }))
            }
          />
          <Input
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            className="md:col-span-2"
          />
          <div className="md:col-span-2">
            <Button type="submit" disabled={saving}>
              {saving ? "Creating..." : "Create Product"}
            </Button>
          </div>
        </form>

        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">Current Products</h2>
          <div className="space-y-4">
            {data.map((p) => (
              <div key={p.id} className="rounded-md border p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{p.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {p.category} · {formatPrice(p.price_cents)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-200 text-red-500"
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
