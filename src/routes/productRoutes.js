const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Public routes
router.get('/', (req, res, next) => {
	/* #swagger.tags = ['Product'] */
	/* #swagger.description = 'Get all products' */
	/* #swagger.security = [{ "bearerAuth": [] }] */
	return next();
}, productController.getAllProducts);
router.get('/:id', (req, res, next) => {
	/* #swagger.tags = ['Product'] */
	/* #swagger.description = 'Get product by ID' */
	/* #swagger.security = [{ "bearerAuth": [] }] */
	return next();
}, productController.getProductById);



router.post('/', (req, res, next) => {
	/* #swagger.tags = ['Product'] */
	/* #swagger.description = 'Create a product' */
	/* #swagger.security = [{ "bearerAuth": [] }] */
	/*  #swagger.parameters['body'] = {
		in: 'body',
		required: true,
		schema: { $ref: '#/definitions/ProductCreate' }
	} */
	return next();
}, productController.createProduct);
router.put('/:id', (req, res, next) => {
	/* #swagger.tags = ['Product'] */
	/* #swagger.description = 'Update a product by ID' */
	/* #swagger.security = [{ "bearerAuth": [] }] */
	/*  #swagger.parameters['id'] = { in: 'path', required: true, type: 'string' } */
	/*  #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/ProductUpdate' } } */
	return next();
}, productController.updateProduct);
router.delete('/:id', (req, res, next) => {
	/* #swagger.tags = ['Product'] */
	/* #swagger.description = 'Delete a product by ID' */
	/* #swagger.security = [{ "bearerAuth": [] }] */
	/*  #swagger.parameters['id'] = { in: 'path', required: true, type: 'string' } */
	return next();
}, productController.deleteProduct);

module.exports = router;