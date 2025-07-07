import { Product, ProductInsert } from "shared";
import { prisma } from "../prisma";

export async function createProducts(products: ProductInsert) {
  return prisma.products.createMany({ data: products });
}

export async function findAllUserProducts(userId: string): Promise<Product[]> {
  return prisma.products.findMany({ where: { userId } });
}

export async function findUniqueProduct(
  productId: number,
): Promise<Product | null> {
  return prisma.products.findUnique({ where: { id: productId } });
}

export async function removeProduct(productId: number): Promise<Product> {
  return prisma.products.delete({ where: { id: productId } });
}
