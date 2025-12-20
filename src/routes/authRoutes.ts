import express, { Request, Response, NextFunction } from "express"
import { authController } from "../controllers/authController"
const router = express.Router();
router.post('/register', (req, res, next) => {

	return next();
}, authController.register);
router.post('/login', (req, res, next) => {

	return next();
}, authController.login);

router.post('/logout', (req, res, next) => {

	return next();
}, authController.logoutUser);

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

 export default router
