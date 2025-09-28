const express = require("express")
const router = express.Router()
//importacion de workouts.routes
const workoutRoutes = require("./workout.routes")
//si "workouts" esta en los parametros entonces vamos al archivo que manejara los metodos HTTP
//
router.use("/workouts", workoutRoutes)

module.exports = router