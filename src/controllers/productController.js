const ProductService = require("../services/productServices")
const productController = {
  getAllProducts: async (req, res) => {
    try {
      const products = await ProductService.getAllProducts();
      console.log(products,'products')
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getProductById: async (req, res) => {
    try {
      const { id } = req.params;
      const products = await ProductService.getProductById(id);
      res.status(200).json(products);
    } catch (error) {
      res.status(404).json({ error: 'Product not found' });
    }
  },

  createProduct: async (req, res) => {
    try {
      const product = await ProductService.createProduct(req.body)
      res.status(201).json({ message: 'Product created successfully', data: product, });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedProduct = await ProductService.updateProduct(id, updateData);

      if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.status(200).json({
        message: 'Product updated successfully',
        data: updatedProduct
      });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: error.message });
    }
  },


  deleteProduct: async (req, res) => {
    try {
      await ProductService.deleteProduct(req.params.id);
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = productController;