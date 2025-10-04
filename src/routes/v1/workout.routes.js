const express = require("express");
const router = express.Router();
// importacion de los controlers
const workoutsControllers = require("../../controllers/workouts.controller");

//gets de workouts

//obtener todos los ejercicios
router.get("/", workoutsControllers.getWorkouts);
//obtener la vaina por id
router.get("/:id", workoutsControllers.getWorkoutsById);

//Post para crear un ejercicio
router.post("/", workoutsControllers.createWorkout);

//put
router.put("/:id", workoutsControllers.updateWorkout);

//patch
router.patch("/:id", workoutsControllers.patchWorkout);

//delete
router.delete("/:id", workoutsControllers.deleteWorkout);

module.exports = router;
