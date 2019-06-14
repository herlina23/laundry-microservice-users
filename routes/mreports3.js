const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

const { index } = require("../controllers/mreport3");
//router.get("/report", index);
router.get("/pengeluaran", index);

router.use(verifyToken);

module.exports = router;
