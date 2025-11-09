const CategoryServices = require("../services/categoryServices");

const CategoryController = {
  CreateCategory: async (req, res) => {
    try {
      const category = await CategoryServices.CreateCategory(req.body);
      res.status(201).json({ message: "Category Created successFully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  getAllCategory: async (req, res) => {
    try {
      const category = await CategoryServices.getAllCategory();
      res
        .status(201)
        .json({ message: "Category Fetched successFully", data: category });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};
module.exports = CategoryController;
