const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  lead_for: { type: String, required: true, unique: true },
  status: { type: String, required: true }
});

const Service = mongoose.model("Service", serviceSchema);
module.exports = Service;