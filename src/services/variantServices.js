const Variant = require('../models/Variant');

const VariantServices = {
  createVariant: async (data) => {
    try {
      const variant = await Variant.create(data);
      return variant;
    } catch (error) {
      throw new Error(`Error creating variant: ${error.message}`);
    }
  },

  getVariantsByProduct: async (productId) => {
    try {
      const variants = await Variant.find({ productId });
      return variants;
    } catch (error) {
      throw new Error(`Error fetching variants: ${error.message}`);
    }
  },
};

module.exports = VariantServices;
