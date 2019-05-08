const Salary = require("../models/Salary");
const User = require("../models/User");
const Item = require("../models/Item");
const Itemin = require("../models/Itemin");
const Itemout = require("../models/Itemout");
const Outcome = require("../models/Outcome");
const Outcomein = require("../models/Outcomein");

module.exports = {
  index: (req, res) => {
    let responseObject;
    Transaction.find()

      .then(transactions => {
        responseObject.pemasukan = 0;
        transactions.forEach(transaction => {
          responseObject.pemasukan += transaction.grandTotal;
        });
        return Salary.find();
      })

      .then(salaries => {
        return Itemin.find();
      })

      .then(itemins => {
        return res.json(responseObject);
      });
  }
  // showSalary: (req, res) => {
  //   if (req.user.role == "admin") {
  //     Salary.find()
  //       .populate("user")
  //       .then(mreport => res.json(mreport))
  //       .catch(err => console.log(err));
  //   } else {
  //     res.sendStatus(403);
  //   }
  // },
  // showItemin: (req, res) => {
  //   if (req.user.role == "admin") {
  //     Itemin.find()
  //       .populate("item")
  //       .then(mreport => res.json(mreport))
  //       .catch(err => console.log(err));
  //   } else {
  //     res.sendStatus(403);
  //   }
  // },
  // showItemout: (req, res) => {
  //   if (req.user.role == "admin") {
  //     Itemout.find()
  //       .populate("item")
  //       .then(mreport => res.json(mreport))
  //       .catch(err => console.log(err));
  //   } else {
  //     res.sendStatus(403);
  //   }
  // },
  // showOutcome: (req, res) => {
  //   if (req.user.role == "admin") {
  //     Outcome.find()
  //       .populate("outcomein")
  //       .then(mreport => res.json(mreport))
  //       .catch(err => console.log(err));
  //   } else {
  //     res.sendStatus(403);
  //   }
  // },
  // showTransaction: (req, res) => {
  //   Transaction.find()
  //     .populate("user")
  //     .populate("member")
  //     .populate("status")
  //     .then(mreport => res.json(mreport))
  //     .catch(err => console.log(err));
  // },
  // showDetail: (req, res) => {
  //   Detail.find({ transaction: req.params.id_trans })
  //     .populate("transaction")
  //     .populate("service")
  //     .populate("process")
  //     .then(mreport => res.json(mreport))
  //     .catch(err => console.log(err));
  // }
};
