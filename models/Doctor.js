const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // ✅ Import bcrypt properly // ✅ Fix: Ensure mongoose is properly imported
const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  fee:{type:String,required:true}, // ✅ Prevent exposing password in queries
  role: { type: String, default: "doctor" },
}, { collection: "doctors" });

// ✅ Hash password before saving
doctorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;