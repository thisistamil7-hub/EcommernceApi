import mongoose from "mongoose";
import { MONGODB_URI } from "./env";

const connectDB = async (): Promise<void> => {
  try {
    console.log("🔍 MONGODB_URI:", MONGODB_URI);

    // Connect using modern Mongoose syntax
    const conn = await mongoose.connect(MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Handle runtime errors
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected");
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("🛑 MongoDB connection closed due to app termination");
      process.exit(0);
    });
  } catch (error: any) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
