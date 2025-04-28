const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  role: { type: String, required: true, unique: true },
  status: { type: String, required: true },
  functionalities: {
    taskManagement: {
      all: { type: Boolean, default: false },
      add: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
    },
    leads: {
      freshFollowup: { type: Boolean, default: false },
      repeatFollowup: { type: Boolean, default: false },
    },
    manageContact: {
      all: { type: Boolean, default: false },
      add: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
    },
  },
});

const Role = mongoose.model("Role", roleSchema);
module.exports = Role;