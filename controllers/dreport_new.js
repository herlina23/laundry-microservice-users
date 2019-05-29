const Salary = require("../models/Salary");
const User = require("../models/User");
const Item = require("../models/Item");
const Itemin = require("../models/Itemin");
const Itemout = require("../models/Itemout");
const Outcome = require("../models/Outcome");
const Outcomein = require("../models/Outcomein");
const Transaction = require("../models/Transaction");
const axios = require("axios");

module.exports = {
  pemasukan: (req, res) => {
    let responseObject = {
      pemasukan: 0
    };
    let { dateIn, dateOut } = req.query;
    dateIn = new Date(dateIn);
    dateOut = new Date(dateOut);
    dateOut.setDate(dateOut.getDate() + 1);

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
    ]).then(transactions => {
      responseObject.pemasukan = transactions[0].totalPay;
      return res.json(responseObject);
    });
  },
  keluarItem: (req, res) => {
    let { dateIn, dateOut } = req.query;
    dateIn = new Date(dateIn);
    dateOut = new Date(dateOut);
    dateOut.setDate(dateOut.getDate() + 1);
    Itemin.aggregate([
      {
        $lookup: {
          from: "items",
          localField: "item",
          foreignField: "_id",
          as: "item"
        }
      },
      {
        $unwind: "$item"
      },
      {
        $addFields: {
          month: {
            $month: "$create_date"
          }
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
            item: "$item"
          },
          "SUM(price)": {
            $sum: "$price"
          }
        }
      },
      {
        $project: {
          item: "$_id.item.item_name",
          year: "$_id.year(create_date)",
          month: "$_id.month(create_date)",
          bayar_barang: "$SUM(price)"
        }
      },
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
      }
    ]).then(itemins => res.json(itemins));
  },
  keluarSalary: (req, res) => {
    let { dateIn, dateOut } = req.query;
    dateIn = new Date(dateIn);
    dateOut = new Date(dateOut);
    dateOut.setDate(dateOut.getDate() + 1);
    Salary.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $addFields: {
          month: {
            $month: "$create_date"
          }
        }
      },
      {
        $group: {
          _id: {
            "month(date)": {
              $month: "$create_date"
            },
            "year(date)": {
              $year: "$create_date"
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
          user: "$_id.user.name",
          year: "$_id.year(date)",
          month: "$_id.month(date)",
          paysalary: "$SUM(total)"
        }
      },
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
      }
    ]).then(salaries => res.json(salaries));
  },
  keluarOutcome: (req, res) => {
    let { dateIn, dateOut } = req.query;

    dateIn = new Date(dateIn);
    dateOut = new Date(dateOut);
    dateOut.setDate(dateOut.getDate() + 1);
    console.log(req.query);
    console.log(dateIn);
    console.log(dateOut);
    Outcome.aggregate([
      {
        $lookup: {
          from: "outcomeins",
          localField: "outcomein",
          foreignField: "_id",
          as: "outcomein"
        }
      },
      {
        $unwind: "$outcomein"
      },
      {
        $addFields: {
          month: {
            $month: "$date"
          }
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
            outcomein: "$outcomein"
          },
          "SUM(total)": {
            $sum: "$total"
          }
        }
      },
      {
        $project: {
          outcomein: "$_id.outcomein.outcomein_name",
          year: "$_id.year(date)",
          month: "$_id.month(date)",
          paybill: "$SUM(total)"
        }
      },
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
      }
    ]).then(outcomes => res.json(outcomes));
  }
};
