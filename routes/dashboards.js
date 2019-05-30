const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

const { pemasukan, layanan, proses } = require("../controllers/dashboard");
// router.get("/", index);
router.get("/pemasukan/", pemasukan);
router.get("/layanan/", layanan);
router.get("/proses/", proses);

router.use(verifyToken);

module.exports = router;
