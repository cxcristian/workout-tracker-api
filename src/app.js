console.log("workout-tracker app");

// importacion desestructurada para obtener los datos del puerto
const { port } = require('./config/env'); // Import the port from the env file

const express = require("express")//importacion de express, commonjs
const app = express()//creamos una instancia de express, donde app tiene todo de express
//se comenta el puerto ya que no se tiene que inicializar al ser llamado de nuestro config/env.js
//const port = 8000 //puerto de escucha
//Inicializacion del servidor

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// importacion de las rutas, las cualses van a llevar a la carpeta routes
const routes = require('./routes');
app.use("/api", routes)

app.listen(port, ()=>{
    console.log(`Servidor corriendo en http://localhost:${port}`)
})