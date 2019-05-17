const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

const { index } = require("../controllers/dreport");

router.use(verifyToken);
router.get("/", index);

module.exports = router;
