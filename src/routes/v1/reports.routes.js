const express = require("express");
const router = express.Router();
const reportsController = require("../../controllers/reports.controller");

// GET /api/v1/reports
router.get("/", reportsController.getReports);

// GET /api/v1/reports/:id
router.get("/:id", reportsController.getReportById);

// POST /api/v1/reports
router.post("/", reportsController.generateReport);

module.exports = router;
