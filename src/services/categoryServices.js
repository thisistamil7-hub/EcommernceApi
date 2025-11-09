const Category = require("../models/Category");

const CategoryServices = {
  CreateCategory: async (data) => {
    try {
      const category = await Category.create(data);
      return category;
    } catch (error) {
      throw new Error(`Error creating Category: ${error.message}`);
    }
  },
  getAllCategory: async () => {
    try {
      const categories = await Category.find();
      return categories;
    } catch (err) {
      throw new Error(`Error Fetching Category: ${err.message}`);
    }
  },
};

module.exports = CategoryServices;
