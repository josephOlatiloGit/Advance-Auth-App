import express from "express";
import { connectDB } from "../db/connectDB.js";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";

const app = express();
dotenv.config(); // To access the env file
const PORT = process.env.PORT || 5000;

// middlewares
app.use(express.json()); // allows us to pass incoming request: req.body
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log("Server running on port", PORT);
});
