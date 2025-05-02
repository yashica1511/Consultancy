const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  gstin: {
    type: String,
    required: true,
    unique: true,  // Ensures no duplicate GSTIN
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  stateCode: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true,  // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model("Client", clientSchema);
