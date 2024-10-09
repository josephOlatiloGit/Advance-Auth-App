import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { connectDB } from "../db/connectDB.js";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";

const app = express();
dotenv.config(); // To access the env file
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
// middlewares
app.use(express.json()); // allows us to parse incoming request
app.use(cookieParser()); //allows us to parse incoming cookies
app.use("/api/auth", authRoutes);

// Make the frontend folder the static asset:
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  connectDB();
  console.log("Server running on port", PORT);
});
