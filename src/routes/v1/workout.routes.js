const express = require("express")
const router = express.Router()
// importacion de los controlers
const workoutsControllers = require("../../controllers/workouts.controllers")
//login y logout
const { login} = require("../../controllers/login.controller")
const { logout } = require("../../controllers/logout.controller")

//auth
const authMiddleware = require("../../middleware/auth.middleware")

//gets de workouts

//obtener todos los ejercicios
router.get("/", authMiddleware, workoutsControllers.getWorkouts)
//obtener la vaina por id
router.get("/:id", authMiddleware, workoutsControllers.getWorkoutsById)

//===============
//Post login y logout
router.post("/login", login )
router.post("/logout",authMiddleware, logout)

//Post para crear un ejercicio
router.post("/", authMiddleware, workoutsControllers.createWorkout)

//put
router.put("/:id", authMiddleware, workoutsControllers.updateWorkout)

//patch
router.patch("/:id", authMiddleware, workoutsControllers.patchWorkout)

//delete
router.delete("/:id", authMiddleware, workoutsControllers.deleteWorkout)


module.exports = router