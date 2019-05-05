const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

// Member Schema
const memberSchema = mongoose.Schema({
  member_id: {
    type: String
  },
  member_name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    unique: true,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  create_date: {
    type: Date,
    default: Date.now()
  }
});

memberSchema.plugin(autoIncrement.plugin, "Member");

const Member = (module.exports = mongoose.model("Member", memberSchema));
