import { Router } from "express";
import productRoutes from "./product";

const apiRouter = Router();

apiRouter.use("/products", productRoutes);

export default apiRouter;
