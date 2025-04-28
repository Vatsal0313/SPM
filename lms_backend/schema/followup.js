const mongoose = require("mongoose");

const FollowUpSchema = new mongoose.Schema(
    {
        customer_id: { type: String, ref: "Contact", required: true },
        lead_for: { type: String, ref: "Service", required: true },
        lead_source: { type: String, ref: "Source", required: true },
        lead_priority: { type: String, required: true },
        contact_name: { type: String, required: true, trim: true },
        company_name: { type: String, trim: true },
        added_by: { type: String, required: true, trim: true },
        allocated_to: [{ type: String, required: true, trim: true }], // Converted to an array
        phone_number: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        status: { type: String, required: true },
        reporting_details: [{ type: String }], // Converted to an array
        budget: [{ type: Number, required: true }], // Converted to an array
        total_follow_up: { type: Number, required: true },
        follow_up_Date: [{ type: Date, required: true }], // Converted to an array
        // date: [{ type: Date, required: true }]
    },
    { timestamps: true }
);

module.exports = mongoose.model("FollowUp", FollowUpSchema);
