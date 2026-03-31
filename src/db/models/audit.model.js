const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Image",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  action: String,
  ip: String,
  route: String,
  method: String,
  userAgent: String,
  value: String,
  time: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Audit", historySchema);
