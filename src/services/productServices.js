const Product = require('../models/Product');

const productService = {
    getAllProducts: async () => {
        try {
            const products = await Product.find();
            return products;
        } catch (error) {
            throw new Error(`Error fetching products: ${error.message}`);
        }
    },

    createProduct: async (data) => {
        try {
            const product = new Product(data);
            await product.save();
            return product;
        }
        catch (error) {
            throw new Error(`Error creating product: ${error.message}`);
        }


    },
    getProductById: async (id) => {
        try {
            const product = await Product.findById(id).populate('user', 'username email');
            return product;
        }
        catch (error) {
            throw new Error(`Error creating product: ${error.message}`);
        }


    },
    updateProduct: async (id, data) => {
        try {
            const product = await Product.findByIdAndUpdate(id, data, { new: true });
            return product;
        }
        catch (error) {
            throw new Error(`Error creating product: ${error.message}`);
        }


    },
    deleteProduct: async (id) => {
        try {
            const product = await Product.findByIdAndDelete(id);
            return product;
        }
        catch (error) {
            throw new Error(`Error creating product: ${error.message}`);
        }
    }
};

module.exports = productService;
