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
  index: (req, res) => {
    let { i } = req.query;
    //console.log(req.query);
    Transaction.aggregate([
      {
        $lookup: {
          from: "members",
          localField: "member",
          foreignField: "_id",
          as: "member"
        }
      },
      {
        $lookup: {
          from: "status",
          localField: "status",
          foreignField: "_id",
          as: "status"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user"
        }
      },

      {
        $unwind: "$member"
      },
      {
        $unwind: "$status"
      },
      {
        $unwind: "$user"
      },

      {
        $project: {
          total: "$total",
          discount: "$discount",
          grandTotal: "$grandTotal",
          invoice: "$invoice",
          member: "$member.member_name",
          user: "$user.name",
          status: "$status.status_name",
          d1: "$dateIn",
          d2: "$dateOut",

          year1: { $year: "$dateIn" },
          month1: { $month: "$dateIn" },
          day1: { $dayOfMonth: "$dateIn" },
          minute1: { $minute: "$dateIn" },
          hour1: { $hour: { $add: ["$dateIn", 7 * 60 * 60000] } },

          year2: { $year: "$dateOut" },
          month2: { $month: "$dateOut" },
          day2: { $dayOfMonth: "$dateOut" }
        }
      },

      {
        $match: {
          invoice: i
        }
      }
    ]).then(transactions => res.json(transactions));
  }
};
