const express = require("express")
const router = express.Router()

const plansRoutes = require("./plans.routes")

router.use("/plans", plansRoutes)

module.exports = router;