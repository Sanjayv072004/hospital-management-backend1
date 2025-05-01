const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const connectDB = require("./config/db");

// ✅ Import Routes
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const messagesRoutes = require("./routes/messagesRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

// ✅ Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/contact", contactRoutes);

// ✅ Connect to MongoDB Before Starting Server
connectDB()
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`)); // ✅ Runs server without seedData()
  })
  .catch((error) => {
    console.error("❌ MongoDB Connection Error:", error);
  });

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("Backend server is running with MongoDB!");
});