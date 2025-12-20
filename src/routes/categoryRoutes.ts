import express from "express"
const router = express.Router();
import {CategoryController} from "../controllers/categoryController"

router.post('/',CategoryController.CreateCategory);
router.get('/',CategoryController.getAllCategory);




 export default router

