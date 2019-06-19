const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

const { index } = require("../controllers/trans");

router.get("/trans", index);

router.use(verifyToken);

module.exports = router;
