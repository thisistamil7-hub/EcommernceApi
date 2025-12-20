
import express, { Response, Request, NextFunction } from "express"
const router = express.Router();
import { OrderController } from "../controllers/orderController";

router.post('/', (req: Request, res: Response, next: NextFunction) => {
	return next();
}, OrderController.CreateOrder);

export default router