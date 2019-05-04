const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

const { showSalary } = require("../controllers/dreport");

router.use(verifyToken);
router.get("/", showSalary);

module.exports = router;
