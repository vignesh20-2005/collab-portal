import mongoose from "mongoose";

const VolunteerSchema = new mongoose.Schema({
    name: String,
    skills: String,
    phone: String,
    location: String,
    ngo: { type: mongoose.Schema.Types.ObjectId, ref: "NGO" },
    joinedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Volunteer", VolunteerSchema);
