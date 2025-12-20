import dotenv from "dotenv";
dotenv.config();

export const NODE_ENV: string = process.env.NODE_ENV || "development";
export const PORT: number = Number(process.env.PORT) || 3000;

// Database
export const MONGODB_URI: string = process.env.MONGODB_URI || "";

// JWT
export const JWT_SECRET: string = process.env.JWT_SECRET || "secret";
export const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || "7d";

// Email
export const SMTP_HOST: string = process.env.SMTP_HOST || "";
export const SMTP_PORT: number = Number(process.env.SMTP_PORT) || 587;
export const SMTP_USER: string = process.env.SMTP_USER || "";
export const SMTP_PASS: string = process.env.SMTP_PASS || "";

// AWS/S3
export const AWS_ACCESS_KEY: string = process.env.AWS_ACCESS_KEY || "";
export const AWS_SECRET_KEY: string = process.env.AWS_SECRET_KEY || "";
export const AWS_REGION: string = process.env.AWS_REGION || "";

// Redis
export const REDIS_URL: string = process.env.REDIS_URL || "";
