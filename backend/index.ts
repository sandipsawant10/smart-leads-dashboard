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

// Temporarily allow all origins by echoing the request origin. This enables deployed
// frontends to call the API during testing. For production, restrict this to
// specific origins and set FRONTEND_URL in Render.
app.use(
  cors({
    origin: true, // reflect request origin
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
