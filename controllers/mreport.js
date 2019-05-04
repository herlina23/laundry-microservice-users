const Salary = require("../models/Salary");
const User = require("../models/User");
const axios = require("axios");

module.exports = {
  showSalary: (req, res) => {
    if (req.user.role == "admin") {
      Salary.find()
        .populate("user")
        .then(mreport => res.json(mreport))
        .catch(err => console.log(err));
    } else {
      res.sendStatus(403);
    }
  }
};
