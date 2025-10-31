const productController = {
  getAllProducts: async (req, res) => {
    try {
      // Get all products logic
      const products = [{productName:"Apple",Price:"180"}]; // Your product data
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getProductById: async (req, res) => {
    try {
      // Get product by ID logic
      const product = { id: req.params.id, name: 'Product Name' };
      res.json(product);
    } catch (error) {
      res.status(404).json({ error: 'Product not found' });
    }
  },

  createProduct: async (req, res) => {
    try {
      // Create product logic
      res.status(201).json({ message: 'Product created successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateProduct: async (req, res) => {
    try {
      // Update product logic
      res.json({ message: 'Product updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      // Delete product logic
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = productController;