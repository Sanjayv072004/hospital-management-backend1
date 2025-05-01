const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const User = require("../models/Users");
const Message = require("../models/Messages");

// ✅ Create a new appointment
router.post("/", async (req, res) => {
  try {
    const { patientId, patientName, doctor, date, time } = req.body;
   
    if (!patientId || !patientName || !doctor || !date || !time) {
      return res.status(400).json({ message: "❌ All fields are required!" });
    }

    const newAppointment = new Appointment({ 
      patientId: new mongoose.Types.ObjectId(req.body.patientId), // ✅ Store patientId as ObjectId
      patientName: req.body.patientName, 
      doctor: new mongoose.Types.ObjectId(req.body.doctor), // ✅ Ensure doctorId is stored correctly
      date: req.body.date, 
      time: req.body.time,
      status: "Active"
    });

    const savedAppointment = await newAppointment.save();

    console.log("✅ Appointment booked:", savedAppointment);
    res.status(201).json(savedAppointment);
  } catch (error) {
    console.error("❌ Error booking appointment:", error);
    res.status(500).json({ message: "Server error occurred." });
  }
});

// ✅ Get appointments for a specific patient
router.get("/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;
    console.log("Fetching appointment history for:", patientId); // ✅ Debugging log  

    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ success: false, message: "❌ Invalid patient ID format!" });
    }  

    const appointments = await Appointment.find({ patientId })
      .populate("doctor", "name fee") // ✅ Correctly references "doctors" collection
      .populate("patientId", "name email"); // ✅ Ensure patient details are also populated  

    if (!appointments.length) {
      return res.status(404).json({ success: false, message: "❌ No appointments found!" });
    }  

    res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.error("❌ Error fetching appointment history:", error);
    res.status(500).json({ success: false, message: "Server error occurred!" });
  }
});
// ✅ Get all appointments (Now ensures patient details populate correctly)
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate({ path: "doctor", select: "name specialization fee" }) // ✅ Fetch doctor details
      .populate({ path: "patientId", model: User, select: "username email" }) // ✅ Fetch patient details
      .sort({ createdAt: -1 }); // ✅ Sort appointments by date (latest first)

    res.status(200).json(appointments);
  } catch (error) {
    console.error("❌ Error fetching appointments:", error);
    res.status(500).json({ message: "Server error occurred." });
  }
});


router.get("/doctor/:doctorId", async (req, res) => {
  try {
    const { doctorId } = req.params;
    console.log("Fetching appointments for doctor:", doctorId); // ✅ Debugging log  

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ success: false, message: "❌ Invalid doctor ID format!" });
    }  

    const appointments = await Appointment.find({ doctor: doctorId })
      .populate("patientId", "name email") // ✅ Fetch patient details  
      .populate("doctor", "name fee"); // ✅ Fetch full doctor details  

    if (!appointments.length) {
      return res.status(404).json({ success: false, message: "❌ No appointments found!" });
    }  

    res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.error("❌ Error fetching doctor appointments:", error);
    res.status(500).json({ success: false, message: "Server error occurred!" });
  }
});
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const appointments = await Appointment.find({ patientId: userId }) // ✅ Ensure field matches schema
      .populate("doctor", "name fee");

    res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.error("❌ Error fetching appointments:", error);
    res.status(500).json({ success: false, message: "Server error occurred!" });
  }
});

// ✅ Cancel an appointment (Update status instead of deleting)
router.put("/:id/cancel", async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "Cancelled" },
      { new: true } // ✅ Ensure the response contains the updated appointment
    );

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.put("/accept/:appointmentId", async (req, res) => {
  try {
    const { appointmentId } = req.params;

    // ✅ Find the appointment
    const appointment = await Appointment.findById(appointmentId).populate("doctor", "name");
    if (!appointment) {
      return res.status(404).json({ success: false, message: "❌ Appointment not found!" });
    }

    // ✅ Ensure `patientId` is present before creating message
    const patientId = appointment.patientId;
    if (!patientId) {
      console.error("❌ Missing patientId for message creation!");
      return res.status(400).json({ success: false, message: "❌ Cannot create message—patientId is missing!" });
    }

    // ✅ Update appointment status
    appointment.status = "Confirmed";
    await appointment.save();

    // ✅ Send confirmation message to patient
    const message = new Message({
      patientId, // ✅ Linking message to patientId
      doctorId: appointment.doctor._id,
      message: `✅ Your appointment with ${appointment.doctor.name} is confirmed on ${appointment.date} at ${appointment.time}.`,
    });

    await message.save();

    res.status(200).json({ success: true, message: "✅ Appointment confirmed & message sent!" });
  } catch (error) {
    console.error("❌ Error accepting appointment:", error);
    res.status(500).json({ success: false, message: "Server error occurred!" });
  }
});

// ✅ Delete an appointment
router.delete("/:id", async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;