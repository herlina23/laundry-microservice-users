const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

const { index, searchByInvoice } = require("../controllers/struk");

router.get("/", index);
router.get("/:invoice", searchByInvoice);
router.use(verifyToken);

module.exports = router;
