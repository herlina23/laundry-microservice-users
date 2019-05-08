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
    let responseObject;
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
          month: 5
        }
      }
    ])
      .then(transactions => {
        //kita dapet hasil dari query sesuai di link tadi
        //kita filter yg bulan sekarang
        let dateNow = new Date();
        transactions.forEach(transact => {
          if (transact.month === dateNow.getMonth()) {
            //ngisi pemasukan sesuai totalPay yg bulan sekarang
            responseObject.pemasukan = transact.totalPay;
          }
        });
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
                "month(dateIn)": {
                  $month: "$create_date"
                },
                "year(dateIn)": {
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
          },
          {
            $match: {
              month: 5
            }
          }
        ]);
      })

      .then(itemins => {
        let dateNow = new Date();
        itemins.forEach(item => {
          if (item.month === dateNow.getMonth()) {
            responseObject.pengeluaran.item = item.bayar_barang;
          }
        });
        return Salary([
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
              paysalary: "$SUM(total)"
            }
          },
          {
            $match: {
              month: 5
            }
          }
        ]);
      })
      .then(salaries => {
        let dateNow = new Date();
        salaries.forEach(salary => {
          if (salary.month === dateNow.getMonth()) {
            responseObject.pengeluaran.salary = salary.paysalary;
          }
        });
        return Outcome([
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
              month: 5
            }
          }
        ]);
      })
      .then(outcomes => {
        let dateNow = new Date();
        outcomes.forEach(transact => {
          if (outcome.month === dateNow.getMonth()) {
            responseObject.pengeluaran.outcome = outcome.paybill;
          }
        });
        return res.json(responseObject);
      });
  }
};
