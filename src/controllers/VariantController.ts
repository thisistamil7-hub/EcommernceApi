import { Request, Response } from "express";
import VariantServices from "../services/varientServices";

export const VariantController = {
  // ✅ Create Variant
  createVariant: async (req: Request, res: Response) => {
    try {
      const variant = await VariantServices.createVariant(req.body);
      res.status(201).json({ success: true, data: variant });
    } catch (error: unknown) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },

  // ✅ Get Variants by Product ID
  getVariantsByProduct: async (req: Request<{ productId: string }>, res: Response) => {
    try {
      const variants = await VariantServices.getVariantsByProduct(req.params.productId);
      res.status(200).json({ success: true, data: variants });
    } catch (error: unknown) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
};
