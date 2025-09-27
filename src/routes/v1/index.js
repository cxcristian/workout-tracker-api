//importacion basica de las librerias

const express = require("express")
const router = express.Router()

//importacion de las rutas especificas

const usersRoutes = require("./users.routes")

//configuracion de las rutas
router.use("/users", usersRoutes)

//exportacion de router
module.exports = router