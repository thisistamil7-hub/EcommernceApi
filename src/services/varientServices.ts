// services/variantServices.ts
import  {Variant, IVariant } from "../models/Variant";

interface VariantData {
  name: string;
  productId: string;
  price?: number;
  stock?: number;
  // Add other fields as needed
}

const VariantServices = {
  // ✅ Create Variant
  createVariant: async (data: VariantData): Promise<IVariant> => {
    try {
      const variant = await Variant.create(data);
      return variant;
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error ? `Error creating variant: ${error.message}` : "Unknown error"
      );
    }
  },

  // ✅ Get Variants by Product ID
  getVariantsByProduct: async (productId: string): Promise<IVariant[]> => {
    try {
      const variants = await Variant.find({ productId });
      return variants;
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error ? `Error fetching variants: ${error.message}` : "Unknown error"
      );
    }
  },
};

export default VariantServices;
