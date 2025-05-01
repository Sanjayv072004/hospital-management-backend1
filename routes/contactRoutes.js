const express = require("express");
const router = express.Router();
const Message = require("../models/contactMessages") // ✅ Import Message model

// ✅ Route to Store Contact Messages for Admin Review
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const newMessage = new Message({
      patientName: name,
      patientEmail: email,
      phone,
      subject,
      message,
      timestamp: new Date(),
    });

    await newMessage.save();
    res.status(201).json({ success: true, message: "✅ Contact message stored successfully!" });
  } catch (error) {
    console.error("❌ Error storing contact message:", error);
    res.status(500).json({ success: false, message: "Server error occurred!" });
  }
});

// ✅ Route to Fetch Messages for Admin Dashboard
router.get("/", async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: -1 }); // ✅ Fetch all messages, newest first
    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("❌ Error retrieving contact messages:", error);
    res.status(500).json({ success: false, message: "Server error occurred!" });
  }
});

module.exports = router;