import express, { Request, Response } from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import rateLimit from "express-rate-limit";
import connectDB from "./config/database";
// import swaggerUi from "swagger-ui-express";

// import swaggerDocument from "./swagger-output.json";

import { NODE_ENV, PORT } from "./config/env";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import variantRoutes from "./routes/variantRoutes";
import customerRoutes from "./routes/customerRoutes";
import verifyToken from "./middleware/authMiddleware";
const app = express();

// ---------------------- MIDDLEWARE ----------------------
app.use(cors({ origin: "*", credentials: false }));
app.use(express.json());

// Optional: rate limiter (if needed)
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100
// });
// app.use(limiter);

// ---------------------- DATABASE ----------------------
connectDB();

// ---------------------- SWAGGER ----------------------
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ---------------------- ROUTES ----------------------
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", verifyToken, productRoutes);
app.use("/api/v1/orders", verifyToken, orderRoutes);
app.use("/api/v1/categories", verifyToken, categoryRoutes);
app.use("/api/v1/variants", verifyToken, variantRoutes);
app.use("/api/v1/customers", verifyToken, customerRoutes);

// ---------------------- HEALTH CHECK ----------------------
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ---------------------- SERVER ----------------------
// const PORT = config.PORT || 5000;
app.listen(PORT || 5000, () => {
  console.log(`🚀 Server running in ${NODE_ENV} mode on port ${PORT}`);
});

export default app;
