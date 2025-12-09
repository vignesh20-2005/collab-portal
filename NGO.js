import mongoose from "mongoose";

const NGOSchema = new mongoose.Schema({
    name: String,
    mission: String,
    contact: String,
    location: String,
    category: String,
    work: [String],
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("NGO", NGOSchema);
