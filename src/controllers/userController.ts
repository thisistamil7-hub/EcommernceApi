
import { userService } from "../services/userServices"
import { Request, Response } from "express"
export const userController = {

  getAllUsers: async (req: Request, res: Response) => {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });

      }
    }
  },

  getUserProfile: async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(500).json({ error: "Unauthroized" });
    }
    try {
      const user = await userService.getUserProfile(req.user.id);
      res.json(user);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });

      }
    }
  },

  getUserById: async (req: Request, res: Response) => {
    try {
      const user = await userService.getUserById(req.params.id);
      res.json(user);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });

      }
    }
  },

  updateUserProfile: async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(500).json({ error: "Unauthroized" });
    }
    try {
      const updatedUser = await userService.updateUserProfile(req.user.id, req.body);
      res.json(updatedUser);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });

      }
    }
  },

  deleteUser: async (req: Request, res: Response) => {
    try {
      const result = await userService.deleteUser(req.params.id, req.params.id, req.params.role);
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });

      }
    }
  },
};

