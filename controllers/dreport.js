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
    let { dateIn, dateOut } = req.body
    dateIn = new Date(dateIn);
    dateOut = new Date(dateOut);
    dateOut.setDate(dateOut.getDate() + 1)
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
        '$match': {
          '$and': [
            {
              'dateIn': {
                '$gte': dateIn
              }
            },
            {
              'dateIn': {
                '$lte': dateOut
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
        res.json(responseObject)
        // return Itemin.aggregate([
        //   {
        //     '$match': {
        //       '$and': [
        //         {
        //           'create_date': {
        //             '$gte': dateIn
        //           }
        //         },
        //         {
        //           'create_date': {
        //             '$lte': dateOut
        //           }
        //         }
        //       ]
        //     }
        //   },
        //   {
        //     $group: {
        //       _id: {
        //         "month(create_date)": {
        //           $month: "$create_date"
        //         },
        //         "year(create_date)": {
        //           $year: "$create_date"
        //         },
        //         "dayOfMonth(create_date)": {
        //           $dayOfMonth: "$create_date"
        //         }
        //         // item: "$item"
        //       },
        //       "SUM(price)": {
        //         $sum: "$price"
        //       }
        //     }
        //   },
        //   {
        //     $project: {
        //       // item: "$_id.item",
        //       dayOfMonth: "$_id.dayOfMonth(create_date)",
        //       year: "$_id.year(create_date)",
        //       month: "$_id.month(create_date)",
        //       bayar_barang: "$SUM(price)"
        //     }
        //   }
        // ])
    })
      // .then(itemins => {
      //   console.log(itemins, responseObject)
      // })
  }
};
