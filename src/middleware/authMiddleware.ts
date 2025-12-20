import { Request, Response, NextFunction } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import { User } from "../models/User"

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.'
      });
    }
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload & { userId: string };

    // Get user from database to ensure they still exist and are active
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found. Token invalid.'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Account is deactivated.'
      });
    }

    // Check if password was changed after token was issued
    if (user.passwordChangedAt) {
      const passwordChangedTimestamp = new Date(
        user.passwordChangedAt.getTime() / 1000,
        10
      );
      if (user.passwordChangedAt && decoded.iat) {
        const passwordChangedAtSeconds =
          Math.floor(user.passwordChangedAt.getTime() / 1000);

        if (passwordChangedAtSeconds > decoded.iat) {
          return res.status(401).json({
            success: false,
            error: 'Password was recently changed. Please login again.'
          });
        }
      }
    }

    // Attach user to request object
    req.user = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);

    // Handle specific JWT errors
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token.'
      });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        error: 'Token expired. Please login again.'
      });
    }

    res.status(401).json({
      success: false,
      error: 'Authentication failed.'
    });
  }
};

export default authMiddleware