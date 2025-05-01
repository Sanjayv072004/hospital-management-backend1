const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true }, // ✅ Ensures messages are linked to patients
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true }, // ✅ Links message to doctor
  message: { type: String, required: true }, // ✅ Message content
  timestamp: { type: Date, default: Date.now } // ✅ Stores when the message was sent
});

module.exports = mongoose.model("Message", messageSchema);