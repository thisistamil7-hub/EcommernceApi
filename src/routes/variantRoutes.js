const express = require('express');
const router = express.Router();
const VariantController = require('../controllers/VariantController');

router.post('/create', (req, res, next) => {
	/* #swagger.tags = ['Variant'] */
	/* #swagger.description = 'Create a new product variant' */
	/* #swagger.security = [{ "bearerAuth": [] }] */
	/*  #swagger.parameters['body'] = {
		in: 'body',
		required: true,
		schema: { $ref: '#/definitions/VariantCreate' }
	} */
	return next();
}, VariantController.createVariant);

router.get('/product/:productId', (req, res, next) => {
	/* #swagger.tags = ['Variant'] */
	/* #swagger.description = 'Get variants by product ID' */
	/* #swagger.security = [{ "bearerAuth": [] }] */
	/*  #swagger.parameters['productId'] = { in: 'path', required: true, type: 'string' } */
	return next();
}, VariantController.getVariantsByProduct);

module.exports = router;
