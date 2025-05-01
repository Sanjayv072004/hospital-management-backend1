const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Patient = require("../models/Patients");
const Doctor = require("../models/Doctor");
const Admin = require("../models/Admin");// ✅ Ensure correct model is imported //

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Doctor.findOne({ email }).select("+password") ||
                 await Patient.findOne({ email }).select("+password") ||
                 await Admin.findOne({ email }).select("+password"); // ✅ Check for admin user

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const role = user.role ||(user instanceof Doctor ? "doctor" : user instanceof Patient ? "patient" :  "admin");// ✅ Ensure role is stored properly

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "yourSecretKey", { expiresIn: "1h" });

    return res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        _id: user._id,
        name: user.name,
        role, // ✅ Now includes "admin" correctly
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    return res.status(500).json({ message: "Server error occurred" });
  }
});

// ✅ Register Doctor Route
router.post("/register-doctor", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: "Doctor already registered" });
    }

    // ✅ Fix: Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    const newDoctor = new Doctor({
      name,
      email,
      password: hashedPassword, // ✅ Store encrypted password
      role: "doctor",
    });

    await newDoctor.save();
    return res.status(201).json({ message: "Doctor registered successfully!" });

  } catch (error) {
    console.error("❌ Error registering doctor:", error);
    return res.status(500).json({ message: "Server error occurred" });
  }
});

module.exports = router; // ✅ Fix: Properly export router