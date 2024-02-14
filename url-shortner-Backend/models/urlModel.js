const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  originalURL: {
    type: String,
    required: true,
  },
  shortId: {
    type: String,
    required: true,
    unique: true,
    minlength: [6, "ShortId must be at least 6 characters long"],
    maxlength: [12, "ShortId must not exceed 12 characters"],
  },
  username: { type: String, unique: true },
  clicks: {
    timeStamps: [{ timeStamp: { type: Number } }],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const URL = mongoose.model("URL", urlSchema);

module.exports = { URL };
