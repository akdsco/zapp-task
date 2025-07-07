import axios from "axios";
import {
  type Product,
  type ProductDeleteResponse,
  type ProductInput,
  type ProductInsert,
  type ProductsCreateResponse,
  type ProductsResponse,
} from "shared";
import { useEffect, useState } from "react";
import { ProductsTable } from "../Components/ProductsTable.tsx";
import { ProductCsvUpload } from "../Components/ProductsCsvUpload.tsx";
import { ProductManualAdd } from "../Components/ProductManualAdd.tsx";
import { Alert } from "@mui/material";

// TODO: move to env once ready for production
const API_URL = "http://localhost:4000/api/v1";

export type WithProductAddProps = {
  addProducts: (products: ProductInput) => Promise<void>;
};

export const ProductManager = () => {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string>(
    localStorage.getItem("productManagerUserId") as string,
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    // TODO: not best setup to make sure userId is always defined, letting go for now (time constraint)
    let userId = localStorage.getItem("productManagerUserId");

    if (!userId) {
      userId = crypto.randomUUID();
      localStorage.setItem("productManagerUserId", userId);
      setUserId(userId);
    }

    try {
      const { data } = await axios.get<ProductsResponse>(
        `${API_URL}/products`,
        { params: { userId } },
      );

      // TODO: this is suboptimal, needs better error handling
      if (data.success) {
        setProducts(data.data);
      } else {
        setError(data.errorMsg || "Unknown error");
      }
    } catch (err) {
      console.error(err, userId);
      setError("Failed to fetch products");
    }
  };

  const addProducts = async (productInput: ProductInput) => {
    setLoading(true);

    if (!userId) {
      // TODO: test in real life, remove if too much?
      throw new Error("User id is required");
    }

    const productInsert: ProductInsert = productInput.map((product) => ({
      userId,
      ...product,
    }));

    const { data } = await axios.post<ProductsCreateResponse>(
      `${API_URL}/products`,
      productInsert,
    );

    if (data.success) {
      await fetchProducts();
      setLoading(false);
    }
  };

  const removeProduct = async (id: number) => {
    setLoading(true);

    const { data } = await axios.delete<ProductDeleteResponse>(
      `${API_URL}/products/${id}`,
      { params: { userId } },
    );

    if (data.success) {
      await fetchProducts();
    } else {
      setError(data.errorMsg || "Unknown error");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProducts().then();
  }, []);

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <ProductCsvUpload addProducts={addProducts} />
      <ProductManualAdd addProducts={addProducts} />
      <ProductsTable {...{ loading, products }} onDelete={removeProduct} />
    </>
  );
};
