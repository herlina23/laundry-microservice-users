const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

const { totalBayar } = require("../controllers/total");

router.get("/bayar", totalBayar);

router.use(verifyToken);

module.exports = router;
