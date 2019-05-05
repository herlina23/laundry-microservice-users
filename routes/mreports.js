const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

const {
  index
} = require("../controllers/mreport");

router.use(verifyToken);
router.get("/reports", index);
module.exports = router;
