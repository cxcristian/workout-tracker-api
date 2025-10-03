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
//Eliminar si no quiero que esto este al alcance de todos
router.get("/:id", authMiddleware, workoutsControllers.getWorkoutsById)

//===============
//Post login y logout
router.post("/login", login )
router.post("/logout",authMiddleware, logout)





module.exports = router