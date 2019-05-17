const Salary = require("../models/Salary");
const User = require("../models/User");
const Item = require("../models/Item");
const Itemin = require("../models/Itemin");
const Itemout = require("../models/Itemout");
const Outcome = require("../models/Outcome");
const Outcomein = require("../models/Outcomein");
const Transaction = require("../models/Transaction");

module.exports = {
  index: (req, res) => {
    // let responseObject;
    a = datetime.datetime(2019, 5, 8);
    b = datetime.datetime(2019, 5, 10);
    let responseObject = {
      pemasukan: 0,
      pengeluaran: {
        salaries: [],
        items: [],
        outcomes: []
      }
    };
    let dateNow = new Date();
    // Transaction.find()
    Transaction.aggregate([
      {
        $match: {
          $and: [
            {
              dateIn: {
                $gte: a
              }
            },
            {
              dateIn: {
                $lte: b
              }
            }
          ]
        }
      },
      {
        $group: {
          _id: {
            "month(dateIn)": {
              $month: "$dateIn"
            },
            "year(dateIn)": {
              $year: "$dateIn"
            },
            "dayOfMonth(dateIn)": {
              $dayOfMonth: "$dateIn"
            }
          },
          "SUM(grandTotal)": {
            $sum: "$grandTotal"
          }
        }
      },
      {
        $project: {
          dayOfMonth: "$_id.dayOfMonth(dateIn)",
          year: "$_id.year(dateIn)",
          month: "$_id.month(dateIn)",
          totalPay: "$SUM(grandTotal)"
        }
      }
    ]).then(transactions => {
      responseObject.pemasukan = transactions[0].totalPay;
      return res.json(responseObject);
    });
  }
};
