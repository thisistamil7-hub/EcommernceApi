import express, { Response, Request, NextFunction, Router } from "express"
const router = express.Router();
import { productController } from "../controllers/productController"
import { validate } from "../middleware/validate"
import { createProductSchema } from "../validation/product.schema"
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

router.post('/', validate(createProductSchema), productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

export default router