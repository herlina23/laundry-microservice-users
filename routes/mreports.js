const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

const { index } = require("../controllers/mreport_new");
router.get("/report", index);
router.use(verifyToken);

module.exports = router;
