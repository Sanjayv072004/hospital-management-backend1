const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor"); // ✅ Import Doctor model

// 📌 GET all doctors
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find(); // ✅ Fetch all doctors from MongoDB
    console.log("📡 Sending doctors:", doctors); // ✅ Debug log
    res.status(200).json(doctors);
  } catch (error) {
    console.error("❌ Error fetching doctors:", error);
    res.status(500).json({ message: "Server error occurred." });
  }
});

// 📌 POST a new doctor
router.post("/", async (req, res) => {
  try {
    const { name, email, password, confirmPassword, fee } = req.body;

    if (!name || !email || !password || !confirmPassword || !fee) {
      return res.status(400).json({ message: "❌ All fields are required!" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "❌ Passwords do not match!" });
    }

    const newDoctor = new Doctor({ name, email, password,confirmPassword, fee }); // ✅ Stores in MongoDB
    const savedDoctor = await newDoctor.save();

    console.log("✅ Doctor added successfully:", savedDoctor);
    res.status(201).json(savedDoctor);
  } catch (error) {
    console.error("❌ Error adding doctor:", error);
    res.status(500).json({ message: "Server error occurred." });
  }
});
// 📌 DELETE a doctor by ID
router.delete("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "❌ Doctor not found!" });
    }

    res.status(200).json({ message: "✅ Doctor removed successfully!" });
  } catch (error) {
    console.error("❌ Error deleting doctor:", error);
    res.status(500).json({ message: "Server error occurred." });
  }
});

module.exports = router;