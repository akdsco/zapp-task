import { Router } from "express";
import {
  deleteProduct,
  getProducts,
  postProducts,
} from "../controllers/product";

const router = Router();

router.get("/", getProducts);
router.post("/", postProducts);
router.delete("/:id", deleteProduct);

export default router;
