const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

const { index } = require("../controllers/mreport2");
router.get("/", index);
router.use(verifyToken);

module.exports = router;
