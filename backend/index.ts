import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

import connectDB from "./src/config/db";
import authRoutes from "./src/routes/auth.routes";
import leadRoutes from "./src/routes/lead.routes";
import { errorHandler } from "./src/middleware/error";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS to allow local and deployed frontend origins.
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  "https://smart-leads-dashboard-flame-chi.vercel.app",
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (like curl, server-to-server) when origin is undefined
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS policy: Origin not allowed"));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);

connectDB();

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "API is running" });
});

app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorHandler);

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

start();
