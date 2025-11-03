const express = require('express');
const router = express.Router();
const VariantController = require('../controllers/VariantController');

router.post('/create', VariantController.createVariant);
router.get('/product/:productId', VariantController.getVariantsByProduct);

module.exports = router;