import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const productRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z
        .object({
          query: z.string().optional(),
          category: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      let query = {};

      if (input?.query) {
        query = {
          ...query,
          title: {
            contains: input.query,
            mode: "insensitive",
          },
        };
      }

      if (input?.category) {
        query = {
          ...query,
          category: input.category,
        };
      }

      return ctx.db.product.findMany({
        where: query,
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.product.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        price_cents: z.number().int().positive(),
        image_urls: z.array(z.string()),
        category: z.string().optional(),
        sizes: z.array(z.string()),
        stock: z.number().int().nonnegative(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (user?.role !== "admin") {
        throw new Error("Only admins can create products");
      }

      return ctx.db.product.create({
        data: input,
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        price_cents: z.number().int().positive().optional(),
        image_urls: z.array(z.string()).optional(),
        category: z.string().optional(),
        sizes: z.array(z.string()).optional(),
        stock: z.number().int().nonnegative().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (user?.role !== "admin") {
        throw new Error("Only admins can update products");
      }

      const { id, ...data } = input;

      return ctx.db.product.update({
        where: { id },
        data,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (user?.role !== "admin") {
        throw new Error("Only admins can delete products");
      }

      return ctx.db.product.delete({
        where: { id: input.id },
      });
    }),
});
