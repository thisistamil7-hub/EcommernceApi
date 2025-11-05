const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');




router.post('/register', (req, res, next) => {
	/* #swagger.tags = ['Auth1'] */
	/* #swagger.description = 'Register user' */
	/*  #swagger.parameters['body'] = {
		in: 'body',
		required: true,
		description: 'User registration payload',
		schema: {
			name: 'John Doe',
			email: 'user@example.com',
			password: 'secret123'
		}
	} */
	return next();
}, authController.register);
router.post('/login', (req, res, next) => {
	/* #swagger.tags = ['Auth1'] */
	/* #swagger.description = 'Login user' */
	/*  #swagger.parameters['body'] = {
		in: 'body',
		required: true,
		description: 'Login credentials',
		schema: {
			email: 'user@example.com',
			password: 'secret123'
		}
	} */
	return next();
}, authController.login);

router.post('/logout', (req, res, next) => {
	/* #swagger.tags = ['Auth1'] */
	/* #swagger.description = 'Logout user' */
	/*  #swagger.parameters['authorization'] = {
		in: 'header',
		description: 'Bearer access token',
		required: true,
		type: 'string',
		default: 'Bearer <token>'
	} */
	return next();
}, authController.logout);

router.post('/forgot-password', (req, res, next) => {
	/* #swagger.tags = ['Auth1'] */
	/* #swagger.description = 'Send password reset link' */
	/*  #swagger.parameters['body'] = {
		in: 'body',
		required: true,
		schema: { email: 'user@example.com' }
	} */
	return next();
}, authController.forgotPassword);

router.post('/reset-password/:token', (req, res, next) => {
	/* #swagger.tags = ['Auth1'] */
	/* #swagger.description = 'Reset password using token' */
	/*  #swagger.parameters['token'] = {
		in: 'path',
		required: true,
		type: 'string'
	} */
	/*  #swagger.parameters['body'] = {
		in: 'body',
		required: true,
		schema: { password: 'newStrongPassword123' }
	} */
	return next();
}, authController.resetPassword);

module.exports = router;
