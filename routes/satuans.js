const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

const {
  index,
  pemasukan,
  keluarItem,
  keluarOutcome,

  keluarSalary
} = require("../controllers/mreport_satuan");
//router.get("/report", index);
router.get("/pemasukan", pemasukan);
router.get("/item", keluarItem);
router.get("/outcome", keluarOutcome);

router.get("/salary", keluarSalary);
router.use(verifyToken);

module.exports = router;
