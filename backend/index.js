import express from "express";
import { connectDB } from "../db/connectDB.js";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";

const app = express();
dotenv.config(); // To access the env file

app.get("/", (req, res) => {
  res.send("Hello world");
});

// middlewares
app.use("/api/auth", authRoutes);

app.listen(3000, () => {
  connectDB();
  console.log("Server running on port 3000");
});
