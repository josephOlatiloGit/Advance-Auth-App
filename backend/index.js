import express from "express";
import cookieParser from "cookie-parser";
import { connectDB } from "../db/connectDB.js";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";

const app = express();
dotenv.config(); // To access the env file
const PORT = process.env.PORT || 5000;
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
// middlewares
app.use(express.json()); // allows us to parse incoming request
app.use(cookieParser()); //allows us to parse incoming cookies
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log("Server running on port", PORT);
});
