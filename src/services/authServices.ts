// services/authService.ts
import { User, Iuser } from "../models/User";
import crypto from "crypto";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sendEmail } from "../utils/emailService"
// Environment variables
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN!;
const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 12;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// TypeScript Interfaces
interface RegisterInput {
  username: string;
  email: string;
  password: string;
  role?: string;
}

interface CredentialsInput {
  email: string;
  password: string;
}

interface ResetDataInput {
  token: string;
  newPassword: string;
}

interface AuthTokenPayload extends JwtPayload {
  userId: string;
  email: string;
  role?: string;
}

interface AuthUser {
  id: string;
  username: string;
  email: string;
  role?: string;
  createdAt?: Date;
  lastLogin?: Date;
}

const authService = {
  // ---------------- Register ----------------
  register: async (userData: RegisterInput) => {
    const { username, email, password, role } = userData;

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) throw new Error("User already exists with this email or username");

    // Hash password
    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // Create user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });
    await newUser.save();

    // JWT payload
    const payload: AuthTokenPayload = {
      userId: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role,
    };

    if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");
    if (!JWT_EXPIRES_IN) throw new Error("JWT_EXPIRES_IN is not defined");

    // Sign JWT (TypeScript-safe)
    const token: string = jwt.sign(payload, JWT_SECRET as string, {
      expiresIn: JWT_EXPIRES_IN as any,
    });

    // Response object
    const userResponse: AuthUser = {
      id: newUser._id.toString(),
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };

    return { user: userResponse, token };
  },

  // ---------------- Login ----------------
  login: async (credentials: CredentialsInput) => {
    const { email, password } = credentials;

    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid email or password");
    if (!user.isActive) throw new Error("Account is deactivated");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid email or password");

    const payload: AuthTokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const token: string = jwt.sign(payload, JWT_SECRET as string, {
      expiresIn: JWT_EXPIRES_IN as any,
    });

    user.lastLogin = new Date();
    await user.save();

    const userResponse: AuthUser = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      lastLogin: user.lastLogin,
    };

    return { user: userResponse, token };
  },

  // ---------------- Forgot Password ----------------
  forgotPassword: async (email: string) => {
    const user = await User.findOne({ email });
    if (!user) return { message: "If the email exists, a reset link will be sent" };

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    const resetUrl = `${CLIENT_URL}/reset-password/${resetToken}`;

    const emailSubject = "Password Reset Request - MyApp Dev";
    const emailText = `
      You requested a password reset.

      Reset your password here: ${resetUrl}

      This link will expire in 15 minutes.

      If you didn't request this, ignore this email.
    `;

    await sendEmail(user.email, emailSubject, emailText);

    if (process.env.NODE_ENV === "development") {
      console.log("DEV: Password reset token:", resetToken);
    }

    return { message: "If the email exists, a reset link will be sent" };
  },

  // ---------------- Reset Password ----------------
  resetPassword: async (resetData: ResetDataInput) => {
    const { token, newPassword } = resetData;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });
    if (!user) throw new Error("Invalid or expired reset token");

    const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.passwordChangedAt = new Date();

    await user.save();

    const emailSubject = "Password Reset Successful - MyApp Dev";
    const emailText = `
      Your password has been successfully reset.
      If you did not perform this action, contact support immediately.
    `;

    await sendEmail(user.email, emailSubject, emailText);

    return { message: "Password reset successful" };
  },
  logout: async (userId: string) => {
    try {
      // Optional: update lastLogout timestamp
      const user = await User.findById(userId);
      if (!user) throw new Error("User not found");

      // You can track logout time if needed
      user.lastLogout = new Date();
      await user.save();

      // Simply return a message — JWT is stateless
      return { message: "Logout successful" };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Logout failed: ${error.message}`);
      }
      throw new Error("Unknown error occurred during logout");
    }
  },


};

export default authService;
