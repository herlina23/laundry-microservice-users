const mongoose = require("mongoose");

// Salary Schema
const salarySchema = mongoose.Schema({
  date: {
    type: Date,
    default: Date.now()
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  employee: {
    type: String,
    ref: "Employee",
    required: true
  },
  total: {
    type: Number,
    required: true
  }
});

const Salary = (module.exports = mongoose.model("Salary", salarySchema));
