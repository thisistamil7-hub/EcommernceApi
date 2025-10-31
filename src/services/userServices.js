// services/userService.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const userService = {
  /**
   * Get all users (with pagination and filtering)
   */
  getAllUsers: async (options = {}) => {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        search = '',
        role = ''
      } = options;

      // Build filter object
      const filter = {};
      
      // Search by username or email
      if (search) {
        filter.$or = [
          { username: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }

      // Filter by role
      if (role) {
        filter.role = role;
      }

      // Pagination
      const skip = (page - 1) * limit;

      // Get users (exclude passwords)
      const users = await User.find(filter)
        .select('-password -resetPasswordToken -resetPasswordExpires')
        .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
        .skip(skip)
        .limit(limit);

      // Get total count for pagination
      const total = await User.countDocuments(filter);
      const totalPages = Math.ceil(total / limit);

      return {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  },

  /**
   * Get user by ID
   */
  getUserById: async (id) => {
    try {
      const user = await User.findById(id)
        .select('-password -resetPasswordToken -resetPasswordExpires');

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      if (error.kind === 'ObjectId') {
        throw new Error('Invalid user ID');
      }
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  },

  /**
   * Get user profile (for authenticated user)
   */
  getUserProfile: async (userId) => {
    try {
      const user = await User.findById(userId)
        .select('-password -resetPasswordToken -resetPasswordExpires');

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw new Error(`Failed to fetch profile: ${error.message}`);
    }
  },

  /**
   * Update user profile
   */
  updateUserProfile: async (userId, updateData) => {
    try {
      // Fields that can be updated
      const allowedUpdates = ['username', 'email', 'firstName', 'lastName', 'phone', 'avatar'];
      const updates = {};

      // Filter only allowed fields
      Object.keys(updateData).forEach(key => {
        if (allowedUpdates.includes(key) && updateData[key] !== undefined) {
          updates[key] = updateData[key];
        }
      });

      // Check if email already exists (if email is being updated)
      if (updates.email) {
        const existingUser = await User.findOne({ 
          email: updates.email, 
          _id: { $ne: userId } 
        });
        
        if (existingUser) {
          throw new Error('Email already exists');
        }
      }

      // Check if username already exists (if username is being updated)
      if (updates.username) {
        const existingUser = await User.findOne({ 
          username: updates.username, 
          _id: { $ne: userId } 
        });
        
        if (existingUser) {
          throw new Error('Username already exists');
        }
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        updates,
        { 
          new: true, // Return updated document
          runValidators: true // Run model validators
        }
      ).select('-password -resetPasswordToken -resetPasswordExpires');

      if (!updatedUser) {
        throw new Error('User not found');
      }

      return updatedUser;
    } catch (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  },

  /**
   * Change user password
   */
  changePassword: async (userId, currentPassword, newPassword) => {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password and track change
      user.password = hashedPassword;
      user.passwordChangedAt = Date.now();
      await user.save();

      return { message: 'Password updated successfully' };
    } catch (error) {
      throw new Error(`Failed to change password: ${error.message}`);
    }
  },

  /**
   * Delete user account
   */
  deleteUser: async (userId, requestingUserId, requestingUserRole) => {
    try {
      // Users can delete themselves, admins can delete any user
      if (userId !== requestingUserId && requestingUserRole !== 'admin') {
        throw new Error('Not authorized to delete this user');
      }

      const user = await User.findById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      // Prevent admin from deleting themselves (optional safety)
      if (user.role === 'admin' && userId === requestingUserId) {
        throw new Error('Admin users cannot delete their own account');
      }

      await User.findByIdAndDelete(userId);

      return { 
        message: 'User deleted successfully',
        deletedUserId: userId 
      };
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  },

  /**
   * Update user role (admin only)
   */
  updateUserRole: async (userId, newRole, adminId) => {
    try {
      // Validate role
      const allowedRoles = ['user', 'admin', 'moderator'];
      if (!allowedRoles.includes(newRole)) {
        throw new Error('Invalid role');
      }

      // Prevent modifying own role
      if (userId === adminId) {
        throw new Error('Cannot modify your own role');
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { role: newRole },
        { new: true, runValidators: true }
      ).select('-password -resetPasswordToken -resetPasswordExpires');

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw new Error(`Failed to update user role: ${error.message}`);
    }
  },

  /**
   * Deactivate/Reactivate user (admin only)
   */
  toggleUserStatus: async (userId, isActive) => {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { isActive },
        { new: true, runValidators: true }
      ).select('-password -resetPasswordToken -resetPasswordExpires');

      if (!user) {
        throw new Error('User not found');
      }

      return {
        user,
        message: `User ${isActive ? 'activated' : 'deactivated'} successfully`
      };
    } catch (error) {
      throw new Error(`Failed to update user status: ${error.message}`);
    }
  },

  /**
   * Get user statistics (admin only)
   */
  getUserStats: async () => {
    try {
      const totalUsers = await User.countDocuments();
      const activeUsers = await User.countDocuments({ isActive: true });
      const adminUsers = await User.countDocuments({ role: 'admin' });
      
      // Users created in the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const newUsers = await User.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
      });

      return {
        totalUsers,
        activeUsers,
        adminUsers,
        newUsers,
        inactiveUsers: totalUsers - activeUsers
      };
    } catch (error) {
      throw new Error(`Failed to fetch user statistics: ${error.message}`);
    }
  }
};

module.exports = userService;