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
    let responseObject = {
      pemasukan: 0,
      // pengeluaran: {
      //   salaries: [],
      //   items: [],
      //   outcomes: []
      // },
      keluarItem: [],
      keluarSalary: [],
      keluarOutcome: []
    };
    let dateNow = new Date();
    // Transaction.find()
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
          month: dateNow.getMonth() + 1
        }
      }
    ])
      .then(transactions => {
        //kita dapet hasil dari query sesuai di link tadi
        //kita filter yg bulan sekarang

        responseObject.pemasukan = transactions[0].totalPay;
        return Itemin.aggregate([
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
              item: "$_id.item",
              year: "$_id.year(create_date)",
              month: "$_id.month(create_date)",
              bayar_barang: "$SUM(price)"
            }
          },
          {
            $match: {
              // month: 5
              month: dateNow.getMonth() + 1
            }
          }
        ]);
      })

      .then(itemins => {
        responseObject.keluarItem = itemins;
        return Salary.aggregate([
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
              user: "$_id.user",
              year: "$_id.year(date)",
              month: "$_id.month(date)",
              paysalary: "$SUM(total)"
            }
          },
          {
            $match: {
              month: dateNow.getMonth() + 1
            }
          }
        ]);
      })
      .then(salaries => {
        responseObject.keluarSalary = salaries;
        return Outcome.aggregate([
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
              outcomein: "$_id.outcomein",
              year: "$_id.year(date)",
              month: "$_id.month(date)",
              paybill: "$SUM(total)"
            }
          },
          {
            $match: {
              month: dateNow.getMonth() + 1
            }
          }
        ]);
      })
      .then(outcomes => {
        responseObject.keluarOutcome = outcomes;
        return res.json(responseObject);
      });
  }
};
