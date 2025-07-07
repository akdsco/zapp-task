import { z } from "zod";

const ProductSchema = z.object({
  id: z.number(),
  userId: z.string(),
  createdAt: z.date(),
  sku: z.string(),
  quantity: z.number().int().nonnegative(),
  description: z.string().nullable(),
  store: z.string(),
});

export const ProductInsertSchema = z.array(
  ProductSchema.omit({
    id: true,
    createdAt: true,
  }),
);

export type Product = z.infer<typeof ProductSchema>;
export type ProductInsert = z.infer<typeof ProductInsertSchema>;

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
