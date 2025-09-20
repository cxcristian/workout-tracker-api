console.log("workout-tracker app");

// importacion desestructurada para obtener los datos del puerto
const { port } = require('./config/env'); // Import the port from the env file

const express = require("express")//importacion de express, commonjs
const app = express()//creamos una instancia de express, donde app tiene todo de express
app.use(express.json())
//se comenta el puerto ya que no se tiene que inicializar al ser llamado de nuestro config/env.js
//const port = 8000 //puerto de escucha
//Inicializacion del servidor

app.get("/", (req, res)=>{
    res.send("Hola mi servidor de express")
})




//Simulacion de base de datos
// Simulación de base de datos en memoria
const db = {
  usuarios: [
    {
      id: 1,
      nombre: "Cristian",
      email: "cristian@mail.com",
      contraseña: "123456",
      fechaRegistro: "2025-09-19T12:00:00Z"
    },
    {
      id: 2,
      nombre: "Santiago",
      email: "santiago@mail.com",
      contraseña: "abcdef",
      fechaRegistro: "2025-09-10T08:30:00Z"
    }
  ],

  ejercicios: [
    {
      id: 1,
      nombre: "Sentadillas",
      descripcion: "Ejercicio básico de piernas",
      categoria: "Piernas central"
    },
    {
      id: 2,
      nombre: "Press de banca",
      descripcion: "Ejercicio de pecho con barra",
      categoria: "Pecho"
    }
  ],

  planes: [
    {
      id: 1,
      idUsuario: 1,
      ejercicios: [
        { idEjercicio: 1, repeticiones: 12, series: 4, peso: "40kg" },
        { idEjercicio: 2, repeticiones: 10, series: 3, peso: "30kg" }
      ],
      fechaCreacion: "2025-09-15T09:00:00Z"
    }
  ],

  sesiones: [
    {
      id: 1,
      idPlan: 1,
      fechaHora: "2025-09-20T10:00:00Z",
      estado: "pendiente",
      observaciones: "Se murio por jugarle al vrg"
    },
    {
      id: 2,
      idPlan: 1,
      fechaHora: "2025-09-18T18:30:00Z",
      estado: "completado",
      observaciones: "le dio un babaiado"
    }
  ],

  reportes: [
    {
      id: 1,
      idUsuario: 1,
      rangoFechas: "2025-09-01 a 2025-09-19",
      estadisticas: {
        ejerciciosCompletados: 15,
        totalSeries: 60,
        totalRepeticiones: 600
      },
      resumen: "Se purgo en algunos ejercicios... mediocre"
    }
  ]
};



//estamos en feat/users

//Datos principales de usuers: ID de usuario, nombre, correo electrónico, contraseña, fecha de registro.
// organizar datos de forma jerarquica para mi mayor orden y paz mental


//Metodo GET

// Lista de usuarios, TODOS
app.get("/users",(req, res)=>{
    res.json(db.usuarios)
    
})

//Llamar a usuario por su ID, estos ":" hacen que sea dinamico
app.get("/users/:id", (req, res)=>{
    //se captura el parametro dinamico que es id
    const id = req.params.id
    //guardamos al usuario que concida con id
    const usuario = db.usuarios.find(usuario => usuario.id === parseInt(id))
    //si no existe se manda el error 404 not found vaina
    if(!usuario){
        return res.status(400).send("Usuario no encontrado")
    }
    //si existe se manda el usuario
    res.send("Usuario por ID: " + JSON.stringify(usuario,null,2))
})


/* 

Lista de mis errores, al parecer viole la jerarquia, ya que ya tengo a users/:id
y al poner users/:name, me genera conflicto, ya que no sabe si es un id o un nombre
asi que para evitar este error, se debe poner primero el mas especifico y luego el mas generico
// llamar a usuarios por su nombre
app.get("/users/:name",(req, res)=>{
    res.send("Usuario por nombre")

})*/

//Metodo POST

//Decidi usar json, toca habilitar el middleware


app.post("/users",(req,res)=>{
    //id automatico creo al igual que la fecha de registro... creo
    
     const { nombre, email, contraseña } = req.body;
     
     //Validaciones

     if(!nombre || !email || !contraseña || nombre.trim()==="" || email.trim()==="" || contraseña.trim()===""){
        return res.status(400).json({error: "Faltan datos obligatorios"})
    }
    //Procesar datos validados
    const NuevoUsuario = {
        id: db.usuarios.length + 1,
        nombre,
        email,
        contraseña,
        fechaRegistro: new Date().toISOString()      
    }
    //subir los datos a la "base de datos"
    db.usuarios.push(NuevoUsuario);
     res.status(201).json({
        mensaje: 'Producto creado exitosamente',
        NuevoUsuario
    });
})

app.listen(port, ()=>{
    console.log(`Servidor corriendo en http://localhost:${port}`)
})