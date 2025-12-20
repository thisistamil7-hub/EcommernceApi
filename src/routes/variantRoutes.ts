// routes/variantRoutes.ts
import { Router } from "express";
import { VariantController } from "../controllers/VariantController";

const router = Router();

// Create a new product variant
router.post("/create", VariantController.createVariant);

// Get variants by product ID
router.get("/product/:productId", VariantController.getVariantsByProduct);

export default router;
