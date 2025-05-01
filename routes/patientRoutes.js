const express = require("express");
const Patient = require("../models/Patients");

const router = express.Router();

// ✅ Register a new patient
router.post("/register", async (req, res) => { 
  try {
    const { name, email, password, age, gender } = req.body;

    if (!name || !email || !password || !age || !gender) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // ✅ Check if email is already registered
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res.status(409).json({ message: "Email already registered! Use a different email." });
    }

    // ✅ Hash password before storing
    const newPatient = new Patient({ name, email, password, age, gender });
    await newPatient.save();

    res.status(201).json({ message: "Registration successful!", patient: newPatient });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ message: `Error occurred: ${error.message}` });
  }
});

// ✅ Fetch all patients
router.get("/", async (req, res) => {
  try {
    console.log("📡 Fetching Patient List...");
    const patients = await Patient.find(); // Fetch all patient records
    console.log("✅ Retrieved Patients:", JSON.stringify(patients, null, 2));

    if (!patients || patients.length === 0) {
      return res.status(404).json({ message: "No patients found!" });
    }

    res.status(200).json(patients); // Return all patients
  } catch (error) {
    console.error("❌ Error fetching patients:", error.message || error);
    return res.status(500).json({ message: "Server error occurred." });
  }
});
// ✅ Delete a patient by ID
router.delete("/patients/:id", async (req, res) => {
  try {
    const patientId = req.params.id; // Get the patient ID from the URL
    console.log(`📡 Attempting to delete patient with ID: ${patientId}`);

    // Delete the patient by _id
    const deletedPatient = await Patient.findByIdAndDelete(patientId);

    if (!deletedPatient) {
      return res.status(404).json({ message: "Patient not found!" });
    }

    console.log(`✅ Successfully deleted patient with ID: ${patientId}`);
    return res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting patient:", error.message || error);
    return res.status(500).json({ message: "Server error occurred." });
  }
});
module.exports = router;