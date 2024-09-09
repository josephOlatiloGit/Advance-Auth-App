import express from "express";
import { connectDB } from "../db/connectDB.js";
import dotenv from "dotenv";

const app = express();
dotenv.config(); // To access the env file

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(3000, () => {
  connectDB();
  console.log("Server running on port 3000");
});
