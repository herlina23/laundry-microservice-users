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
    let { m, y } = req.query;
    m = parseInt(m);
    y = parseInt(y);

    Transaction.aggregate([
      {
        $addFields: {
          "month(dateIn)": {
            $month: "$dateIn"
          }
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
          totalPay: "$SUM(grandTotal)"
        }
      },
      {
        $match: {
          month: m,
          year: y
        }
      }
    ]).then(transactions => {
      responseObject.pemasukan = transactions[0].totalPay;
      return res.json(responseObject);
    });
  },
  keluarItem: (req, res) => {
    let { m, y } = req.query;
    m = parseInt(m);
    y = parseInt(y);
    let responseObject = {
      keluarItem: 0
    };
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
            }
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
          bayar_barang: "$SUM(price)"
        }
      },
      {
        $match: {
          month: m,
          year: y
        }
      }
    ]).then(itemins => {
      responseObject.keluarItem = itemins[0].bayar_barang;
      return res.json(responseObject);
    });
  },
  keluarSalary: (req, res) => {
    let { m, y } = req.query;
    m = parseInt(m);
    y = parseInt(y);
    let responseObject = {
      keluarSalary: 0
    };
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
            }
          },
          "SUM(total)": {
            $sum: "$total"
          }
        }
      },
      {
        $project: {
          year: "$_id.year(date)",
          month: "$_id.month(date)",
          paysalary: "$SUM(total)"
        }
      },
      {
        $match: {
          month: m,
          year: y
        }
      }
    ]).then(salaries => {
      responseObject.keluarSalary = salaries[0].paysalary;
      return res.json(responseObject);
    });
  },
  keluarOutcome: (req, res) => {
    let { m, y } = req.query;
    m = parseInt(m);
    y = parseInt(y);
    let responseObject = {
      keluarOutcome: 0
    };

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
            }
          },
          "SUM(total)": {
            $sum: "$total"
          }
        }
      },
      {
        $project: {
          year: "$_id.year(date)",
          month: "$_id.month(date)",
          paybill: "$SUM(total)"
        }
      },
      {
        $match: {
          month: m,
          year: y
        }
      }
    ]).then(outcomes => {
      responseObject.keluarOutcome = outcomes[0].paybill;
      return res.json(responseObject);
    });
  }
};
