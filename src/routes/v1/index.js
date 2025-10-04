const express = require("express")
const router = express.Router()

const reportsRoutes = require("./reports.routes")
router.use("/reports", reportsRoutes)


module.exports = router