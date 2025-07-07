import { z } from "zod";

const ProductSchema = z.object({
  id: z.number(),
  userId: z.string(),
  createdAt: z.date(),
  sku: z.string().min(1, "SKU is required"),
  quantity: z.number().int().nonnegative(),
  description: z.string().nullable(),
  store: z.string().min(1, "Store is required"),
});

export const ProductInsertSchema = z.array(
  ProductSchema.omit({
    id: true,
    createdAt: true,
  }),
);

export const ProductInputSchema = z.array(
  ProductSchema.omit({
    id: true,
    userId: true,
    createdAt: true,
  }),
);

export type Product = z.infer<typeof ProductSchema>;
export type ProductInsert = z.infer<typeof ProductInsertSchema>;
export type ProductInput = z.infer<typeof ProductInputSchema>;

export type Identified = { id: string };

export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; errorMsg: string };

export type ProductsResponse = ApiResponse<Product[]>;
export type ProductsCreateResponse = ApiResponse<{ count: number }>;
export type ProductDeleteResponse = ApiResponse<{ id: number }>;

export const apiSuccess = <T>(data: T): ApiResponse<T> => ({
  success: true,
  data,
});

export const apiFailure = <T = never>(errorMsg: string): ApiResponse<T> => ({
  success: false,
  errorMsg,
});
