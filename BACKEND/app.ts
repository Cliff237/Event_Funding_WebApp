import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import authRoutes from "./src/routes/authRoute";
 
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authRoutes);

export default app;
