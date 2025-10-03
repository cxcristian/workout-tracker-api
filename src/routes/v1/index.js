const express = require("express")
const router = express.Router()

const sessionsRoutes = require("./sessions.routes")

router.use("/sessions", sessionsRoutes)
module.exports = router