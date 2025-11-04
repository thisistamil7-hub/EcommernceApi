const VariantServices = require('../services/varientServices');

const VariantController = {
  createVariant: async (req, res) => {
    try {
      const variant = await VariantServices.createVariant(req.body);
      res.status(201).json({ success: true, data: variant });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  getVariantsByProduct: async (req, res) => {
    try {
      const variants = await VariantServices.getVariantsByProduct(req.params.productId);
      res.status(200).json({ success: true, data: variants });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
};

module.exports = VariantController;
