const express = require("express");
const router = express.Router();
const dashboardController = require("../../controller/admin/dashboard.controller");
router.get("/", dashboardController.index);
module.exports = router;
