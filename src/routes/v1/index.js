//importacion basica de las librerias

const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/auth.middleware");
const { login } = require("../../controllers/login.controller");
const { logout } = require("../../controllers/logout.controller");

//importacion de las rutas especificas

const usersRoutes = require("./users.routes");

//configuracion de las rutas
router.use("/users", authMiddleware, usersRoutes);

//importacion de workouts.routes
const workoutRoutes = require("./workout.routes");
//si "workouts" esta en los parametros entonces vamos al archivo que manejara los metodos HTTP

router.use("/workouts", authMiddleware, workoutRoutes);

const sessionsRoutes = require("./sessions.routes");

router.use("/sessions", authMiddleware, sessionsRoutes);

const reportsRoutes = require("./reports.routes");
router.use("/reports", authMiddleware, reportsRoutes);

const plansRoutes = require("./plans.routes");
router.use("/plans", authMiddleware, plansRoutes);

///login
//loguearse tampoco
router.post("/login", login);
//cerrar sesion menos
router.post("/logout", authMiddleware, logout);
module.exports = router;
