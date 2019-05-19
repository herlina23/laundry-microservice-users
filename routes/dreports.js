const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

const { index } = require("../controllers/dreport22");

router.use(verifyToken);
router.post("/", index);

module.exports = router;
