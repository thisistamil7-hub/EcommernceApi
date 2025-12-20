import { Category, Icategory } from "../models/Category";
export const CategoryServices = {
  CreateCategory: async (data: Icategory): Promise<Icategory> => {
    try {
      const category = await Category.create(data);
      return category;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error creating Category: ${error.message}`);

      }
      else {
        throw new Error(`Error creating Category: unKnown Error`);

      }
    }
  },
  getAllCategory: async (): Promise<Icategory[]> => {
    try {
      const categories = await Category.find();
      return categories;
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Error creating Category: ${err.message}`);

      }
      else {
        throw new Error(`Error creating Category: unKnown Error`);

      }
    }
  },
};

