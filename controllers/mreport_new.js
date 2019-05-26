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
    let { m, y } = req.query;
    m = parseInt(m);
    y = parseInt(y);
    let responseObject = {
      pemasukan: 0,

      pengeluaran: {
        salaries: [],
        items: [],
        outcomes: []
      },
      laba: 0,
      keluar: 0,
      keluarItem: 0,
      keluarSalary: 0,
      KeluarOutcome: 0,
      bulan: 0,
      tahun: 0
    };
    // Transaction.find()
    Transaction.aggregate([
      {
        $match: {
          month: m,
          year: y
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
      }
    ])
      .then(transactions => {
        //kita dapet hasil dari query sesuai di link tadi
        //kita filter yg bulan sekarang
        responseObject.pemasukan = transactions[0].totalPay;

        return Itemin.aggregate([
          {
            $match: {
              month: m,
              year: y
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
                // item: "$item"
              },
              "SUM(price)": {
                $sum: "$price"
              }
            }
          },
          {
            $project: {
              // item: "$_id.item",
              year: "$_id.year(create_date)",
              month: "$_id.month(create_date)",
              bayar_barang: "$SUM(price)"
            }
          }
        ]);
      })

      .then(itemins => {
        responseObject.pengeluaran.items = itemins;
        return Salary.aggregate([
          {
            $match: {
              month: m,
              year: y
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
          }
        ]);
      })
      .then(salaries => {
        responseObject.pengeluaran.salaries = salaries;
        return Outcome.aggregate([
          {
            $match: {
              month: m,
              year: y
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
              paysalary: "$SUM(total)"
            }
          }
        ]);
      })
      .then(outcomes => {
        responseObject.pengeluaran.outcomes = outcomes;

        responseObject.bulan = responseObject.pengeluaran.outcomes[0].month;
        responseObject.tahun = responseObject.pengeluaran.outcomes[0].year;

        responseObject.keluarItem =
          responseObject.pengeluaran.items[0].bayar_barang;

        responseObject.KeluarOutcome =
          responseObject.pengeluaran.outcomes[0].paysalary;

        responseObject.keluarSalary =
          responseObject.pengeluaran.salaries[0].paysalary;

        responseObject.keluar =
          responseObject.pengeluaran.items[0].bayar_barang +
          responseObject.pengeluaran.outcomes[0].paysalary +
          responseObject.pengeluaran.salaries[0].paysalary;

        // cara menghitung labanya gimana ? (pemasukan - pengeluaran), tapi kenapa hasil laba:null ?
        responseObject.laba =
          responseObject.pemasukan -
          (responseObject.pengeluaran.items[0].bayar_barang +
            responseObject.pengeluaran.outcomes[0].paysalary +
            responseObject.pengeluaran.salaries[0].paysalary);
        return res.json(responseObject);
      });
  }
};
