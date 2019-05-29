const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

const { index } = require("../controllers/dreport");
router.post("/", index);
router.use(verifyToken);

module.exports = router;
