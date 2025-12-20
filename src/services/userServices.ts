

import mongoose from "mongoose";
import { Iuser, User } from "../models/User"
import bcrypt from "bcryptjs"
interface GetAllUsersOptions {
  page?: number;
  limit?: number;
  sortBy?: keyof Iuser;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  role?: string;
}

export const userService = {

  getAllUsers: async (options: GetAllUsersOptions = {}) => {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        search = '',
        role = ''
      } = options;

      const filter: Record<string, any> = {};

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

      const users = await User.find(filter)
        .select('-password -resetPasswordToken -resetPasswordExpires')
        .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
        .skip(skip)
        .limit(limit);

      const total = await User.countDocuments(filter);
      const totalPages = Math.ceil(total / limit);

      return {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch users: ${error.message}`);
      }
      throw error;
    }
  },



  getUserById: async (id: string) => {
    try {
      const user = await User.findById(id)
        .select('-password -resetPasswordToken -resetPasswordExpires');

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) {
        throw new Error('Invalid user ID');
      }

      if (error instanceof Error) {
        throw new Error(`Failed to fetch user: ${error.message}`);
      }

      throw error;
    }
  },


  getUserProfile: async (userId: string) => {
    try {
      const user = await User.findById(userId)
        .select('-password -resetPasswordToken -resetPasswordExpires');

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch profile: ${error.message}`);

      }

    }
  },


  updateUserProfile: async (userId: string, updateData: Iuser) => {
    try {
      const allowedUpdates: (keyof Iuser)[] = [
        'username',
        'email',
      ];

      const updates: Partial<Iuser> = {};

      (Object.keys(updateData) as (keyof Iuser)[]).forEach((key) => {
        if (allowedUpdates.includes(key) && updateData[key] !== undefined) {
          updates[key] = updateData[key];
        }
      });

      // Email check
      if (updates.email) {
        const existingUser = await User.findOne({
          email: updates.email,
          _id: { $ne: userId },
        });

        if (existingUser) {
          throw new Error('Email already exists');
        }
      }

      // Username check
      if (updates.username) {
        const existingUser = await User.findOne({
          username: updates.username,
          _id: { $ne: userId },
        });

        if (existingUser) {
          throw new Error('Username already exists');
        }
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        updates,
        {
          new: true,
          runValidators: true,
        }
      ).select('-password -resetPasswordToken -resetPasswordExpires');

      if (!updatedUser) {
        throw new Error('User not found');
      }

      return updatedUser;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update profile: ${error.message}`);
      }
      throw error;
    }
  },

  changePassword: async (userId: string, currentPassword: string, newPassword: string) => {
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
      const saltRounds = Number(process.env.BCRYPT_ROUNDS) || 12;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password and track change
      user.password = hashedPassword;
      user.passwordChangedAt = new Date();
      await user.save();

      return { message: 'Password updated successfully' };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to change password: ${error.message}`);

      }
    }
  },


  deleteUser: async (userId: string, requestingUserId: string, requestingUserRole: string) => {
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
      if (error instanceof Error)
        throw new Error(`Failed to delete user: ${error.message}`);
    }
  },

  /**
   * Update user role (admin only)
   */
  updateUserRole: async (userId: string, newRole: string, adminId: string) => {
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
      if (error instanceof Error) {
        throw new Error(`Failed to update user role: ${error.message}`);

      }
    }
  },

  /**
   * Deactivate/Reactivate user (admin only)
   */
  toggleUserStatus: async (userId: string, isActive: boolean) => {
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
      if (error instanceof Error)
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
      if (error instanceof Error)
        throw new Error(`Failed to fetch user statistics: ${error.message}`);
    }
  }
};

