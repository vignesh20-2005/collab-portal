import express from "express";
import Volunteer from "./Volunteer.js";

const router = express.Router();

// GET volunteers
router.get("/volunteer", async (req, res) => {
    const volunteers = await Volunteer.find();
    res.json(volunteers);
});

// CREATE volunteer
router.post("/volunteer", async (req, res) => {
    const volunteer = new Volunteer(req.body);
    await volunteer.save();
    res.json({ message: "Volunteer Added", volunteer });
});

// DELETE volunteer
router.delete("/volunteer/:id", async (req, res) => {
    const deleted = await Volunteer.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not Found" });
    res.json({ message: "Volunteer Deleted" });
});

export default router;
