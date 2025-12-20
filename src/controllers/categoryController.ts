import {CategoryServices} from "../services/categoryServices"
import { Response, Request } from "express"
export const CategoryController = {
  CreateCategory: async (req: Request, res: Response) => {
    try {
      const category = await CategoryServices.CreateCategory(req.body);
      res.status(201).json({ message: "Category Created successFully" });
    } catch (err) {
      if (err instanceof Error) {
        res.status(500).json({ message: err.message });

      }
      else {
        res.status(500).json({ message: "unknown error " });

      }
    }
  },
  getAllCategory: async (req: Request, res: Response) => {
    try {
      const category = await CategoryServices.getAllCategory();
      res
        .status(201)
        .json({ message: "Category Fetched successFully", data: category });
    } catch (err) {
      if (err instanceof Error) {
        res.status(500).json({ message: err.message });

      }
      else {
        res.status(500).json({ message: "unknown error " });

      }
    }
  },
};
