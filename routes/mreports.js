const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

const {
  showSalary,
  showDetail,
  showItemin,
  showItemout,
  showOutcome,
  showTransaction
} = require("../controllers/mreport");

router.use(verifyToken);
router.get("/showSalary/", showSalary);
router.get("/showDetail/", showDetail);
router.get("/showItemin/", showItemin);
router.get("/showItemout/", showItemout);
router.get("/showOutcome/", showOutcome);
router.get("/showTransaction/", showTransaction);

module.exports = router;
