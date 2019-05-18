const Salary = require("../models/Salary");
const User = require("../models/User");
const Item = require("../models/Item");
const Itemin = require("../models/Itemin");
const Itemout = require("../models/Itemout");
const Outcome = require("../models/Outcome");
const Outcomein = require("../models/Outcomein");
const Transaction = require("../models/Transaction");
const Detail = require("../models/Detail");

module.exports = {
  index: (req, res) => {
    Detail.aggregate([
      {
        $lookup: {
          from: "processes",
          localField: "process",
          foreignField: "_id",
          as: "process"
        }
      },

      {
        $lookup: {
          from: "transactions",
          localField: "transaction",
          foreignField: "_id",
          as: "transaction"
        }
      },

      {
        $lookup: {
          from: "services",
          localField: "service",
          foreignField: "_id",
          as: "service"
        }
      },
      {
        $unwind: "$service"
      },
      {
        $unwind: "$transaction"
      },
      {
        $unwind: "$process"
      },
      {
        $project: {
          transaction: "$transaction._id",
          invoice: "$transaction.invoice",
          datein: "$transaction.dateIn",
          datein: "$transaction.dateOut",
          qty: 1,
          unit: "$service.unit",
          total: "$transaction.total",
          discount: "$transaction.discount",
          grandtotal: "$transaction.grandTotal",
          service: "$service.serviceName",
          process: "$process.process_name"
        }
      }
    ])

      .then(detail => res.json(detail))
      .catch(err => console.log(err));

    // .then(transactions => {
    //   responseObject.pemasukan = transactions[0].totalPay;
    //   return res.json(responseObject);
    // });
  },

  searchByInvoice: (req, res) => {
    Transaction.findOne({ invoice: req.params.invoice })
      .then(transaction => {
        Detail.find({ transaction: transaction._id });

        return Detail.aggregate([
          {
            $lookup: {
              from: "processes",
              localField: "process",
              foreignField: "_id",
              as: "process"
            }
          },

          {
            $lookup: {
              from: "transactions",
              localField: "transaction",
              foreignField: "_id",
              as: "transaction"
            }
          },

          {
            $lookup: {
              from: "services",
              localField: "service",
              foreignField: "_id",
              as: "service"
            }
          },
          {
            $unwind: "$service"
          },
          {
            $unwind: "$transaction"
          },
          {
            $unwind: "$process"
          },
          {
            $project: {
              transaction: "$transaction._id",
              invoice: "$transaction.invoice",
              datein: "$transaction.dateIn",
              datein: "$transaction.dateOut",
              qty: 1,
              unit: "$service.unit",
              total: "$transaction.total",
              discount: "$transaction.discount",
              grandtotal: "$transaction.grandTotal",
              service: "$service.serviceName",
              process: "$process.process_name"
            }
          }
        ])

          .then(detail => res.json(detail))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }
};
