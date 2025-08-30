"use client";

import { useState } from "react";
import { SiteHeader } from "~/components/site-header";
import { SiteFooter } from "~/components/site-footer";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useToast } from "~/hooks/use-toast";
import { motion } from "framer-motion";

export default function ContactPage() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulating form submission
    setTimeout(() => {
      toast({
        title: "Message sent",
        description: "We'll get back to you soon!",
      });

      setName("");
      setEmail("");
      setMessage("");
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto max-w-xl"
        >
          <h1 className="text-2xl font-bold">Contact Us</h1>
          <p className="text-muted-foreground mt-2">
            Have a question or feedback? We{"'"}d love to hear from you.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                placeholder="How can we help you?"
                className="border-input focus-visible:ring-ring min-h-[150px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:outline-none"
              />
            </div>

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Sending..." : "Send Message"}
            </Button>
          </form>

          <div className="mt-12 border-t pt-8">
            <h2 className="text-lg font-semibold">Other Ways to Reach Us</h2>

            <div className="mt-4 space-y-4">
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-muted-foreground">contact@streetlab.com</p>
              </div>

              <div>
                <h3 className="font-medium">Phone</h3>
                <p className="text-muted-foreground">+1 (555) 123-4567</p>
              </div>

              <div>
                <h3 className="font-medium">Address</h3>
                <p className="text-muted-foreground">
                  123 Fashion Street
                  <br />
                  New York, NY 10001
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
      <SiteFooter />
    </div>
  );
}
