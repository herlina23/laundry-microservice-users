const Salary = require("../models/Salary");
const User = require("../models/User");

module.exports = {
  index: (req, res) => {
    if (req.user.role == "admin") {
      Salary.find()
        .populate("user")
        .then(salary => res.json(salary))
        .catch(err => console.log(err));
    } else {
      res.sendStatus(403);
    }
  },
  show: (req, res) => {
    if (req.user.role == "admin") {
      Salary.findById(req.params.id)
        .populate("user")
        .then(salary => res.json(salary))
        .catch(err => console.log(err));
    } else {
      res.sendStatus(403);
    }
  },
  update: (req, res) => {
    if (req.user.role == "admin") {
      Salary.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { new: true }
      )
        .then(salary => res.json(salary))
        .catch(err => console.log(err));
    } else {
      res.sendStatus(403);
    }
  },
  store: (req, res) => {
    if (req.user.role == "admin") {
      Salary.create({ ...req.body })
        .then(salary => res.json(salary))
        .catch(err => console.log(err));
    } else {
      res.sendStatus(403);
    }
  },
  destroy: (req, res) => {
    if (req.user.role == "admin") {
      Salary.findOneAndDelete({ _id: req.params.id })
        .then(salary => res.json(salary))
        .catch(err => console.log(err));
    } else {
      res.sendStatus(403);
    }
  }
};
