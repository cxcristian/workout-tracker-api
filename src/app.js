console.log("workout-tracker app");

// importacion desestructurada para obtener los datos del puerto
const { port } = require('./config/env'); // Import the port from the env file

const express = require("express")//importacion de express, commonjs
const app = express()//creamos una instancia de express, donde app tiene todo de express
//se comenta el puerto ya que no se tiene que inicializar al ser llamado de nuestro config/env.js
//const port = 8000 //puerto de escucha
//Inicializacion del servidor

app.get("/", (req, res)=>{
    res.send("Hola mi servidor de express")
})

app.listen(port, ()=>{
    console.log(`Servidor corriendo en http://localhost:${port}`)
})
//estamos en feat/users