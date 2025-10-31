const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'Access denied. No token provided.' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
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
      const passwordChangedTimestamp = parseInt(
        user.passwordChangedAt.getTime() / 1000, 
        10
      );
      
      if (passwordChangedTimestamp > decoded.iat) {
        return res.status(401).json({ 
          success: false,
          error: 'Password was recently changed. Please login again.' 
        });
      }
    }

    // Attach user to request object
    req.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);

    // Handle specific JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid token.' 
      });
    }

    if (error.name === 'TokenExpiredError') {
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

module.exports = authMiddleware;