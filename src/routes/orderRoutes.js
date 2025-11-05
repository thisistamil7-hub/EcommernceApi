const express = require('express');
const router =express.Router();
const OrderController= require('../controllers/orderController');

router.post('/', (req, res, next) => {
	/* #swagger.tags = ['Order'] */
	/* #swagger.description = 'Create a new order' */
	/* #swagger.security = [{ "bearerAuth": [] }] */
	/*  #swagger.parameters['authorization'] = {
		in: 'header',
		description: 'Bearer access token',
		required: true,
		type: 'string',
		default: 'Bearer <token>'
	} */
	/*  #swagger.parameters['body'] = {
		in: 'body',
		required: true,
		schema: { $ref: '#/definitions/OrderCreate' }
	} */
	return next();
}, OrderController.CreateOrder);

module.exports = router;