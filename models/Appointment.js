const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true }, // ✅ Ensure reference to "User" model
  patientName: { type: String, required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true }, // ✅ Reference correct User model // ✅ Correct reference to "Doctor"
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, default: "Active" },
});

module.exports = mongoose.model("Appointment", appointmentSchema);