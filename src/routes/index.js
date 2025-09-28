const express = require("express")
const router = express.Router()
//importamos el index de v1
const v1Routes = require("./v1")
//si el parametro v1 existe entonces vamos al archivo index de la carpeta v1
router.use("/v1", v1Routes)

module.exports = router