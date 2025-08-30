import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const orderRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
    });

    // If admin, return all orders
    if (user?.role === "admin") {
      return ctx.db.order.findMany({
        include: {
          items: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    // If regular user, return only their orders
    return ctx.db.order.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      let order;

      if (user?.role === "admin") {
        order = await ctx.db.order.findUnique({
          where: { id: input.id },
          include: {
            items: true,
          },
        });
      } else {
        // Non-admin users can only view their own orders
        order = await ctx.db.order.findFirst({
          where: {
            id: input.id,
            userId: ctx.session.user.id,
          },
          include: {
            items: true,
          },
        });
      }

      if (!order) {
        throw new Error("Order not found");
      }

      return order;
    }),

  create: publicProcedure
    .input(
      z.object({
        customer_name: z.string(),
        customer_phone: z.string().optional(),
        items: z.array(
          z.object({
            product_id: z.string(),
            title: z.string(),
            unit_price_cents: z.number().int().positive(),
            quantity: z.number().int().positive(),
            size: z.string().optional(),
            image: z.string().optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Calculate total price
      const totalCents = input.items.reduce(
        (sum, item) => sum + item.unit_price_cents * item.quantity,
        0,
      );

      // Get the user ID if logged in
      const userId = ctx.session?.user?.id;

      // Create the order
      const order = await ctx.db.order.create({
        data: {
          customer_name: input.customer_name,
          customer_phone: input.customer_phone,
          total_cents: totalCents,
          userId: userId,
          items: {
            create: input.items.map((item) => ({
              product_id: item.product_id,
              title: item.title,
              quantity: item.quantity,
              size: item.size,
              unit_price_cents: item.unit_price_cents,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      return order;
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["pending", "processing", "delivered", "cancelled"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (user?.role !== "admin") {
        throw new Error("Only admins can update order status");
      }

      return ctx.db.order.update({
        where: { id: input.id },
        data: { status: input.status },
      });
    }),
});
