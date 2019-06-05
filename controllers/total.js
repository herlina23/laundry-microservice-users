const Salary = require("../models/Salary");
const User = require("../models/User");
const Item = require("../models/Item");
const Itemin = require("../models/Itemin");
const Itemout = require("../models/Itemout");
const Outcome = require("../models/Outcome");
const Outcomein = require("../models/Outcomein");
const Transaction = require("../models/Transaction");
const Detail = require("../models/Detail");
const axios = require("axios");

module.exports = {
  totalBayar: (req, res) => {
    let { i } = req.query;
    //console.log(req.query);

    Detail.aggregate([
      {
        $lookup: {
          from: "services",
          localField: "service",
          foreignField: "_id",
          as: "service"
        }
      },
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
        $unwind: "$service"
      },
      {
        $unwind: "$process"
      },
      {
        $unwind: "$transaction"
      },

      {
        $project: {
          service: "$service.serviceName",
          process: "$process.process_name",
          transaction: "$transaction.invoice",
          qty: "$qty",
          tarif: "$service.tarif",
          unit: "$service.unit",
          price: {
            $multiply: ["$qty", "$service.tarif"]
          }
        }
      },
      {
        $match: {
          transaction: i
        }
      }
    ]).then(details => res.json(details));
  }
};
