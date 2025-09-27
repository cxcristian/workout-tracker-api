//indice primario de routes v1

//importacion OTRA VEZ de express y router
const express = require("express")
const router = express.Router()

//importacion de las verciones de rutas

//V1
const v1Routes = require("./v1")
//configuracion de la ruta v1
router.use("/v1", v1Routes)


//se exporta eta vaina

module.exports = router;