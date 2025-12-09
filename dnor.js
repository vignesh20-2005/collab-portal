import express from "express";
import Donor from "./Donor.js";

const router = express.Router();

// GET donors
router.get("/donor", async (req, res) => {
    const donors = await Donor.find();
    res.json(donors);
});

// CREATE donor
router.post("/donor", async (req, res) => {
    const donor = new Donor(req.body);
    await donor.save();
    res.json({ message: "Donation Recorded", donor });
});

// DELETE donor
router.delete("/donor/:id", async (req, res) => {
    const deleted = await Donor.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not Found" });
    res.json({ message: "Donor Entry Deleted" });
});

export default router;
