const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  task: { type: String, required: true },
  priority: { type: String, enum: ["Low", "Medium", "High"], required: true },
  contact: { type: String, required: true },
  startDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  assignTo: { type: String, required: true },
  assignBy: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ["Incomplete", "Completed"], default: "Incomplete" }
});

module.exports = mongoose.model("Task", TaskSchema);