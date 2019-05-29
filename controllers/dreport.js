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
    let { dateIn, dateOut } = req.body;
    // console.log(req.body);
    dateIn = new Date(dateIn);
    // console.log(dateIn);
    dateOut = new Date(dateOut);
    dateOut.setDate(dateOut.getDate() + 1);
    let responseObject = {
      pemasukan: 0,
      pengeluaran: {
        salaries: [],
        items: [],
        outcomes: []
      }
    };

    Transaction.aggregate([
      {
        $match: {
          $and: [
            {
              dateIn: {
                $gte: dateIn
              }
            },
            {
              dateIn: {
                $lte: dateOut
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
          year: "$_id.year(dateIn)",
          month: "$_id.month(dateIn)",
          dayOfMonth: "$_id.dayOfMonth(dateIn)",
          totalPay: "$SUM(grandTotal)"
        }
      }
    ])
      .then(transactions => {
        responseObject.pemasukan = transactions[0].totalPay;
        return Itemin.aggregate([
          {
            $match: {
              $and: [
                {
                  create_date: {
                    $gte: dateIn
                  }
                },
                {
                  create_date: {
                    $lte: dateOut
                  }
                }
              ]
            }
          },

          {
            $group: {
              _id: {
                "month(create_date)": {
                  $month: "$create_date"
                },
                "year(create_date)": {
                  $year: "$create_date"
                },
                "dayOfMonth(create_date)": {
                  $dayOfMonth: "$create_date"
                },
                item: "$item"
              },
              "SUM(price)": {
                $sum: "$price"
              }
            }
          },
          {
            $project: {
              year: "$_id.year(create_date)",
              month: "$_id.month(create_date)",
              dayOfMonth: "$_id.dayOfMonth(create_date)",
              user: "$_id.item",
              totalBuy: "$SUM(price)"
            }
          }
        ]);
      })
      .then(itemins => {
        responseObject.pengeluaran.items = itemins;
        return Salary.aggregate([
          {
            $match: {
              $and: [
                {
                  create_date: {
                    $gte: dateIn
                  }
                },
                {
                  create_date: {
                    $lte: dateOut
                  }
                }
              ]
            }
          },

          {
            $group: {
              _id: {
                "month(create_date)": {
                  $month: "$create_date"
                },
                "year(create_date)": {
                  $year: "$create_date"
                },
                "dayOfMonth(create_date)": {
                  $dayOfMonth: "$create_date"
                },
                user: "$user"
              },
              "SUM(total)": {
                $sum: "$total"
              }
            }
          },
          {
            $project: {
              year: "$_id.year(create_date)",
              month: "$_id.month(create_date)",
              dayOfMonth: "$_id.dayOfMonth(create_date)",
              user: "$_id.user",
              paySalary: "$SUM(total)"
            }
          }
        ]);
      })
      .then(salaries => {
        responseObject.pengeluaran.salaries = salaries;
        return Outcome.aggregate([
          {
            $match: {
              $and: [
                {
                  date: {
                    $gte: dateIn
                  }
                },
                {
                  date: {
                    $lte: dateOut
                  }
                }
              ]
            }
          },
          {
            $group: {
              _id: {
                "month(date)": {
                  $month: "$date"
                },
                "year(date)": {
                  $year: "$date"
                },
                "dayOfMonth(date)": {
                  $dayOfMonth: "$date"
                },
                outcomein: "$outcomein"
              },
              "SUM(total)": {
                $sum: "$total"
              }
            }
          },
          {
            $project: {
              outcomein: "$_id.outcomein",
              year: "$_id.year(date)",
              month: "$_id.month(date)",
              dayOfMont: "$_id.dayOfMonth(date)",
              paybill: "$SUM(total)"
            }
          }
        ]);
      })
      .then(outcomes => {
        responseObject.pengeluaran.outcomes = outcomes;
        return res.json(responseObject);
      });
  }
};
