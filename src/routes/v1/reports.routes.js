const express = require('express');
const router = express.Router();
const reportsController = require('../../controllers/reports.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const { login } = require("../../controllers/login.controller");
const { logout } = require("../../controllers/logout.controller");
//login
router.post("/login", login)
router.post("/logout", authMiddleware, logout)

// GET /api/v1/reports
router.get('/', authMiddleware,reportsController.getReports);

// GET /api/v1/reports/:id
router.get('/:id',authMiddleware, reportsController.getReportById);

// POST /api/v1/reports
router.post('/',authMiddleware, reportsController.generateReport);

module.exports = router;