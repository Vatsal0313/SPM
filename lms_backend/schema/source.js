const mongoose = require("mongoose");
const sourceSchema = new mongoose.Schema({
  lead_source: { type: String, required: true, unique: true },
  status: { type: String, required: true }
});
const Source = mongoose.model("Source", sourceSchema);
module.exports = Source;