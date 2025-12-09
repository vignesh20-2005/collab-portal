import mongoose from "mongoose";

const DonorSchema = new mongoose.Schema({
    name: String,
    phone: String,
    donation: String,
    message: String,
    ngo: { type: mongoose.Schema.Types.ObjectId, ref: "NGO" },
    donatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Donor", DonorSchema);
