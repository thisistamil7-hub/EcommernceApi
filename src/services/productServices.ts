import { Types } from "mongoose";
import { Product, IProduct } from "../models/Product"
export const ProductService = {
  getAllProducts: async () => {
    try {
      const products = await Product.aggregate([
        // 🔹 Join category info
        {
          $lookup: {
            from: "categories", // ✅ matches Category collection
            localField: "category", // Product.category
            foreignField: "_id",
            as: "categoryData",
          },
        },
        {
          $unwind: {
            path: "$categoryData",
            preserveNullAndEmptyArrays: true, // keep product even if no category
          },
        },

        {
          $lookup: {
            from: "variants", // ✅ matches Category collection
            localField: "_id", // Product.category
            foreignField: "productId",
            as: "variantsData",
          },
        },

        // 🔹 Final output shape
        {
          $project: {
            _id: 1,
            name: 1,
            slug: 1,
            description: 1,
            basePrice: 1,
            brand: 1,
            image: 1,
            createdAt: 1,
            category: "$categoryData.name",
            variants: {
              $map: {
                input: "$variantsData",
                as: "variant",
                in: {
                  sku: "$$variant.sku",
                  price: "$$variant.price",
                  stock: "$$variant.stock",
                  color: "$$variant.color",
                  size: "$$variant.size",
                  isActive: "$$variant.isActive",
                },
              },
            },
          },
        },
      ]);

      return products;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error fetching products: ${error.message}`);

      }
    }
  },

  createProduct: async (data: IProduct) => {
    try {
      const product = new Product(data);
      await product.save();
      return product;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error creating products: ${error.message}`);

      }
    }
  },

  getProductById: async (id: string) => {
    try {
      const product = await Product.findById(id)
        .populate("category", "name")
        .populate("variants");
      return product;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error fetching product by ID: ${error.message}`);

      }
    }
  },

  updateProduct: async (id: string, data: IProduct) => {
    try {
      const product = await Product.findByIdAndUpdate(id, data, { new: true });
      return product;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error updating product: ${error.message}`);
      }
    }
  },

  deleteProduct: async (id: string) => {
    try {
      const product = await Product.findByIdAndDelete(id);
      return product;
    } catch (error) {
      if (error instanceof Error) {

        throw new Error(`Error deleting product: ${error.message}`);

      }
    }
  },
};


