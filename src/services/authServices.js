const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/emailService");

const authService = {
  /**
   * Register a new user
   */
  register: async (userData) => {
    try {
      const { username, email, password, role } = userData;

      // Check if user already exists
      const existingUser = await User.findOne({ 
        $or: [{ email }, { username }] 
      });
      
      if (existingUser) {
        throw new Error('User already exists with this email or username');
      }

      // Hash password using environment variable
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create new user
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        role: role || 'user'
      });

      // Save user to database
      await newUser.save();

      // Generate JWT token using environment variables
      const token = jwt.sign(
        { 
          userId: newUser._id, 
          email: newUser.email,
          role: newUser.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // Remove password from response
      const userResponse = {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt
      };

      return {
        user: userResponse,
        token
      };
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  },

  /**
   * Login user
   */
  login: async (credentials) => {
    try {
      const { email, password } = credentials;

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new Error('Account is deactivated');
      }

      // Verify password
      console.log(user.password,"user.password")
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user._id, 
          email: user.email,
          role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Remove password from response
      const userResponse = {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin
      };

      return {
        user: userResponse,
        token
      };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  },

  /**
   * Forgot password - send reset email
   */
  forgotPassword: async (email) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        // Don't reveal whether email exists or not for security
        return { message: 'If the email exists, a reset link will be sent' };
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes

      // Save reset token to user
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = resetTokenExpiry;
      await user.save();

      // Create reset URL using environment variable
      const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

      // Send email
      const emailSubject = 'Password Reset Request - MyApp Dev';
      const emailText = `
        You requested a password reset for your MyApp Development account.
        
        Reset your password here: ${resetUrl}
        
        This link will expire in 15 minutes.
        
        If you didn't request this, please ignore this email.
        
        Best regards,
        MyApp Development Team
      `;

      await sendEmail(user.email, emailSubject, emailText);

      // In development, you might want to log the reset token
      if (process.env.NODE_ENV === 'development') {
        console.log('DEV: Password reset token:', resetToken);
      }

      return { 
        message: 'If the email exists, a reset link will be sent'
      };
    } catch (error) {
      throw new Error(`Password reset request failed: ${error.message}`);
    }
  },

  /**
   * Reset password with token
   */
  resetPassword: async (resetData) => {
    try {
      const { token, newPassword } = resetData;

      // Find user by valid reset token
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
        throw new Error('Invalid or expired reset token');
      }

      // Hash new password
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update user password and clear reset token
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      user.passwordChangedAt = Date.now();

      await user.save();

      // Send confirmation email
      const emailSubject = 'Password Reset Successful - MyApp Dev';
      const emailText = `
        Your password has been successfully reset.
        
        If you did not perform this action, please contact support immediately.
        
        Best regards,
        MyApp Development Team
      `;

      await sendEmail(user.email, emailSubject, emailText);

      return { message: 'Password reset successful' };
    } catch (error) {
      throw new Error(`Password reset failed: ${error.message}`);
    }
  }
};

module.exports = authService;