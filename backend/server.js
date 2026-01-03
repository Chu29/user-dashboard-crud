require("dotenv").config();
import express, { json } from "express";
import cors from "cors";
import { connect } from "mongoose";
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(json());

// MongoDB connection
connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected Successfully"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Routes
const usersRoutes = require("./routes/users");
app.use("/api/users", usersRoutes);

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the User Dashboard API" });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});