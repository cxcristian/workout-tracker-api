const express = require("express")
const router = express.Router()
// importacion de los controlers
const workoutsControllers = require("../../controllers/workouts.controllers")

//gets de workouts
router.get("/", workoutsControllers.getWorkouts)

module.exports = router