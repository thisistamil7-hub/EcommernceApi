import express, { Response, Request, NextFunction } from "express"
import { ProductService } from "../services/productServices"
export const productController = {
  getAllProducts: async (req: Request, res: Response) => {
    try {
      const products = await ProductService.getAllProducts();
      console.log(products, 'products')
      res.status(200).json(products);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });

      }
      else {
        res.status(500).json({ message: "unknown Error" });
      }
    }
  },

  getProductById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params; 
      const products = await ProductService.getProductById(id);
      res.status(200).json(products);
    } catch (error) {
      res.status(404).json({ error: 'Product not found' });
    }
  },

  createProduct: async (req: Request, res: Response) => {
    try {
      const product = await ProductService.createProduct(req.body)
      res.status(201).json({ message: 'Product created successfully', data: product, });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });

      }
      else {
        res.status(500).json({ message: "unknown Error" });
      }
    }
  },

  updateProduct: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedProduct = await ProductService.updateProduct(id, updateData);

      if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.status(200).json({
        message: 'Product updated successfully',
        data: updatedProduct
      });
    } catch (error) {
      console.error('Error updating product:', error);
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });

      }
      else {
        res.status(500).json({ message: "unknown Error" });
      }
    }
  },


  deleteProduct: async (req: Request, res: Response) => {
    try {
      await ProductService.deleteProduct(req.params.id);
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });

      }
      else {
        res.status(500).json({ message: "unknown Error" });
      }
    }
  }
};

