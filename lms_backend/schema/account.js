const mongoose = require("mongoose");

// Account Schema
const accountSchema = new mongoose.Schema({
  employee_id: { type: String, required: true, unique: true },
  username: { type: String, required: true, trim: true },
  head: { type: String, required: true, trim: true },
  department: { type: String, trim: true },
  email: { type: String, required: true, unique: true },
  phone_number: { type: String, trim: true },
  password: { type: String, required: true },
  address: { type: String, trim: true },
  dob: { type: Date,},
  hp: { type: String, required: true },
  status: { type: String},
  designation: { type: String, required: true },
  role: { type: String, ref: "Role", required: true },
  today_follow_up: { type: Number, required: true },
  open_lead: { type: Number, required: true },
  close_lead: { type: Number, required: true },
  cancel_lead: { type: Number, required: true },
  dormant_lead: { type: Number, required: true },
  completed_task: { type: Number, required: true },
  incomplete_task: { type: Number, required: true },
}, { timestamps: true });

const Account = mongoose.model("Account", accountSchema);
module.exports = Account;