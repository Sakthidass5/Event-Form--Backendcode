const mongoose = require("mongoose")

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    eventType: { type: String, enum: ["Workshop", "Seminar", "Conference"], required: true },
    participants: { type: [String], default: [], validate: v => v.length >= 1 },
    eventDate: { type: Date, required: true },
    description: { type: String, maxlength: 500 },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema)
