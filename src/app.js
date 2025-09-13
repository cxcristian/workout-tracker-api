console.log("workout-tracker app");

const express = require("express")//importacion de express, commonjs
const app = express()//creamos una instancia de express, donde app tiene todo de express
const port = 8000 //puerto de escucha
//Inicializacion del servidor

app.get("/", (req, res)=>{
    res.send("Hola mi servidor de express")
})

app.listen(port, ()=>{
    console.log(`Servidor corriendo en http://localhost:${port}`)
})