const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  customer_id: { type: String, required: true, unique: true },
  lead_for: { type: String, ref: "Service", required: true },
  lead_source: { type: String, ref: "Source", required: true },
  lead_priority: { type: String, required: true },
  contact_name: { type: String, required: true, trim: true },
  company_name: { type: String, trim: true },
  added_by: { type: String, required: true, trim: true },
  allocated_to: { type: String, required: true, trim: true },
  phone_number: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  address: { type: String, required: true, trim: true },
  budget: { type: Number },
  follow_up_date: { type: String, required: true },
  reporting_details: String
},{ timestamps: true });

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;