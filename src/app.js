console.log("workout-tracker app");
// este archivo no es el original(por ahora), es para organizar el propyecto


//importamos las rutas
const express = require("express")//importacion de express, commonjs
const routes = require("./routes")

// importacion desestructurada para obtener los datos del puerto
const { port } = require('./config/env'); // Import the port from the env file
console.log(port);

const app = express()//creamos una instancia de express, donde app tiene todo de express

// Middleware para parsear JSON

app.use(express.json())
//se comenta el puerto ya que no se tiene que inicializar al ser llamado de nuestro config/env.js
//const port = 8000 //puerto de escucha
//Inicializacion del servidor

app.use(express.urlencoded({ extended: true }));


// configuracion inicial - saludo si api funciona

app.get("/",(req,res)=>{
    res.send("API probablemente funcionando")
})


// Montar las rutas principales
app.use("/api", routes);

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});