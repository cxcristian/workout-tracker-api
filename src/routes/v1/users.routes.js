const express = require("express")
//se crea una instncia de router,importamos la clase Router
const router = express.Router()

// get /v1/users
router.get("/",(req,res)=>{
   res.send("Listado de usuarios")
})

//exportacion con common js
module.exports = router