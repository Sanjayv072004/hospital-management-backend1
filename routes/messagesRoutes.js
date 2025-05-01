const express = require("express");
const router = express.Router();
const Message = require("../models/Messages"); // ✅ Import Message Model

// ✅ Route to Fetch Messages for a Specific Patient
router.get("/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;
    console.log("Fetching messages for patient:", patientId); // ✅ Debugging log

    const messages = await Message.find({ patientId })
      .populate("doctorId", "name");

    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("❌ Error fetching messages:", error);
    res.status(500).json({ success: false, message: "Server error occurred!" });
  }
});

// ✅ Route to Create a New Message (Triggered When Appointment is Confirmed)
router.post("/", async (req, res) => {
  try {
    const { patientId, doctorId, messageContent } = req.body;

    if (!patientId || !doctorId || !messageContent) {
      return res.status(400).json({ success: false, message: "❌ Missing required fields!" });
    }

    const newMessage = new Message({
      patientId,
      doctorId,
      message: messageContent,
    });

    await newMessage.save();
    res.status(201).json({ success: true, message: "✅ Message sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending message:", error);
    res.status(500).json({ success: false, message: "Server error occurred!" });
  }
});

// ✅ Route to Delete a Message (If Needed)
router.delete("/:messageId", async (req, res) => {
  try {
    const { messageId } = req.params;
    const deletedMessage = await Message.findByIdAndDelete(messageId);

    if (!deletedMessage) {
      return res.status(404).json({ success: false, message: "❌ Message not found!" });
    }

    res.status(200).json({ success: true, message: "✅ Message deleted successfully!" });
  } catch (error) {
    console.error("❌ Error deleting message:", error);
    res.status(500).json({ success: false, message: "Server error occurred!" });
  }
});

module.exports = router;