import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// ✅ Updated routes to match your renamed files
import ngoRoutes from "./go.js";
import volunteerRoutes from "./olunteer.js";
import donorRoutes from "./dnor.js";

const app = express();
app.use(express.json());
app.use(cors());

// ✅ MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/ngoFinalDB")
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("Database Error:", err));

// ✅ Registering the routes
app.use("/", ngoRoutes);
app.use("/", volunteerRoutes);
app.use("/", donorRoutes);

// ✅ Start server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
