import { Request, Response, NextFunction } from "express";
import authService from "../services/authServices"

export const authController = {
  register: async (req: Request, res: Response) => {
    try {
      const result = await authService.register(req.body);
      res.status(201).json({
        message: 'User registered successfully',
        data: result
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      }
      else {
        res.status(500).json({ message: "Unknown error" });
      }
    }
  },


  login: async (req: Request, res: Response) => {
    try {
      const result = await authService.login(req.body);
      res.json({
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      }
      else {
        res.status(500).json({ message: "Unknown error" });
      }
    }
  },

  // controllers/authController.ts
  logoutUser: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new Error("User not authenticated");

      const result = await authService.logout(userId);

      res.status(200).json({ success: true, ...result });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },


  forgotPassword: async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const result = await authService.forgotPassword(email);
      res.json({
        message: result.message
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      }
      else {
        res.status(500).json({ message: "Unknown error" });
      }
    }
  },

  resetPassword: async (req: Request, res: Response) => {
    try {
      const { token, newPassword } = req.body;
      const result = await authService.resetPassword({ token, newPassword });
      res.json({
        message: 'Password reset successful',
        data: result
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      }
      else {
        res.status(500).json({ message: "Unknown error" });
      }
    }
  },


};

