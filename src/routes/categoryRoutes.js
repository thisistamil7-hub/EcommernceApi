const express = require('express');
const router =express.Router();
const CategoryController= require('../controllers/categoryController');

router.post('/', (req, res, next) => {
	/* #swagger.tags = ['Category'] */
	/* #swagger.description = 'Create a category' */
	/* #swagger.security = [{ "bearerAuth": [] }] */
	/*  #swagger.parameters['body'] = {
		in: 'body',
		required: true,
		schema: { $ref: '#/definitions/CategoryCreate' }
	} */
	return next();
}, CategoryController.CreateCategory);

module.exports = router;


