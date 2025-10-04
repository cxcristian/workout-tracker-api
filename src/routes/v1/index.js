//importacion basica de las librerias

const express = require("express");
const router = express.Router();

//importacion de las rutas especificas

const usersRoutes = require("./users.routes");

//configuracion de las rutas
router.use("/users", usersRoutes);

//importacion de workouts.routes
const workoutRoutes = require("./workout.routes");
//si "workouts" esta en los parametros entonces vamos al archivo que manejara los metodos HTTP

router.use("/workouts", workoutRoutes);

const sessionsRoutes = require("./sessions.routes");

router.use("/sessions", sessionsRoutes);

const reportsRoutes = require("./reports.routes");
router.use("/reports", reportsRoutes);

module.exports = router;
