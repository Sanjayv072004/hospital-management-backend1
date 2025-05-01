const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Doctor = require("../models/Doctor"); // ✅ Ensure correct model import

// ✅ Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/hospitalDB", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

async function updatePasswords() {
  const doctors = await Doctor.find({}).select("+password"); // ✅ Explicitly retrieve passwords

  for (const doctor of doctors) {
    if (!doctor.password) {
      console.warn(`❌ Skipping ${doctor.email} - No password found in DB`);
      continue; // ✅ Skip doctors without a stored password
    }

    if (!doctor.password.includes("$2b$")) { // ✅ Only hash unencrypted passwords
      const hashedPassword = await bcrypt.hash(doctor.password, 10);
      await Doctor.updateOne({ _id: doctor._id }, { password: hashedPassword });
      console.log(`🔄 Updated password for ${doctor.email}`);
    }
  }
  
  console.log("✅ Password update completed!");
  mongoose.disconnect(); // ✅ Close the DB connection when done
}

updatePasswords();