import express from "express";
import NGO from "./NGO.js";

const router = express.Router();

// GET all NGOs
router.get("/ngo", async (req, res) => {
    const ngos = await NGO.find();
    res.json(ngos);
});

// CREATE NGO
router.post("/ngo", async (req, res) => {
    const ngo = new NGO(req.body);
    await ngo.save();
    res.json({ message: "NGO Created", ngo });
});

// DELETE NGO
router.delete("/ngo/:id", async (req, res) => {
    const deleted = await NGO.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not Found" });
    res.json({ message: "NGO Deleted" });
});

export default router;
