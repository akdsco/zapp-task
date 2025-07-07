import { RequestHandler } from "express";
import {
  apiFailure,
  apiSuccess,
  Identified,
  ProductDeleteResponse,
  ProductInsert,
  ProductInsertSchema,
  ProductsCreateResponse,
  ProductsResponse,
} from "shared";
import {
  createProducts,
  findAllUserProducts,
  findUniqueProduct,
  removeProduct,
} from "../services/product";

type UserQueryParam = { userId?: string };

export const getProducts: RequestHandler<
  never,
  ProductsResponse,
  never,
  UserQueryParam,
  never
> = async (req, res) => {
  const userId = String(req.query.userId);
  console.log("Product data request", JSON.stringify(req.query));

  if (!userId) {
    console.warn("No userId", req.query);
    return void res
      .status(400)
      .json(apiFailure("Parameter 'userId' is missing"));
  }

  try {
    const result = await findAllUserProducts(userId);
    res.status(200).json(apiSuccess(result));
  } catch (error) {
    console.error(error);
    res.status(500).json(apiFailure("Server error"));
  }
};

export const postProducts: RequestHandler<
  never,
  ProductsCreateResponse,
  ProductInsert,
  never,
  never
> = async (req, res) => {
  const { body } = req;

  const {
    success,
    data: productsToInsert,
    error,
  } = ProductInsertSchema.safeParse(body);

  if (!success) {
    console.warn("API received bad request", body, error);
    return void res.status(400).json(apiFailure("Invalid input"));
  }

  try {
    const result = await createProducts(productsToInsert);
    console.log("Product created successfully", result);

    res.status(201).json(apiSuccess({ count: result.count }));
  } catch (error) {
    console.error("Product create fail", error, body);
    res.status(500).json(apiFailure("Failed to create products"));
  }
};

export const deleteProduct: RequestHandler<
  Identified,
  ProductDeleteResponse,
  never,
  UserQueryParam,
  never
> = async (req, res) => {
  const productId = parseInt(req.params.id);
  const userId = String(req.query.userId);

  // TODO: this is suboptimal, needs better management
  if (!productId || Number.isNaN(productId) || !userId) {
    console.error("Missing parameters");
    return void res
      .status(400)
      .json(apiFailure("Parameter 'id' or 'userId' is missing"));
  }
  console.log(
    `Product remove request`,
    JSON.stringify({ id: productId, userId }),
  );

  try {
    const product = await findUniqueProduct(productId);

    if (!product) {
      console.log(
        "User requested removal of a product, but it wasn't found in database",
        product,
      );
      return void res
        .status(404)
        .json(apiFailure("Selected product not found in database"));
    }

    if (product.userId !== userId) {
      console.log(
        "User requested removal of a product that belongs to someone else",
        product,
      );
      return void res
        .status(403)
        .json(apiFailure("Not authorized to delete this product"));
    }

    const result = await removeProduct(productId);
    console.log("Product deleted successfully", result);

    res.status(200).json(apiSuccess({ id: result.id }));
  } catch (error) {
    console.error(error, productId, userId);
    res.status(500).json(apiFailure("Failed to delete product"));
  }
};
