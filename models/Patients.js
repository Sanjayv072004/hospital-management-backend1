const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, // ✅ Trim spaces
  email: { type: String, required: true, unique: true, lowercase: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }, // ✅ Validate email format
  password: { type: String, required: true, minlength: 6 }, // ✅ Enforce password length
  age: { type: Number, required: true, min: 0 }, // ✅ Prevent negative age
  gender: { type: String, required: true, enum: ["Male", "Female", "Other"] }, // ✅ Ensure valid gender input
}, { timestamps: true }); // ✅ Add timestamps for tracking

// ✅ Hash password before saving
PatientSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error); // ✅ Handle potential errors in hashing
  }
});

// ✅ Compare passwords for login validation
PatientSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Patient = mongoose.model("Patient", PatientSchema);
module.exports = Patient;