console.log("workout-tracker app");

// importacion desestructurada para obtener los datos del puerto
const { port } = require('./config/env'); // Import the port from the env file

const express = require("express")//importacion de express, commonjs
const app = express()//creamos una instancia de express, donde app tiene todo de express
app.use(express.json())
//se comenta el puerto ya que no se tiene que inicializar al ser llamado de nuestro config/env.js
//const port = 8000 //puerto de escucha
//Inicializacion del servidor

let tokens = [] // Almacenamiento simple de tokens

app.get("/", (req, res) => {
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
app.get("/users", (req, res) => {
  let resultados = db.usuarios;

  const { nombre, email, limit } = req.query;

  // Filtrar por nombre si lo envían
  if (nombre) {
    resultados = resultados.filter(resultado =>
      resultado.nombre.toLowerCase().includes(nombre.toLowerCase())
    );
  }

  // Filtrar por email si lo envían
  if (email) {
    resultados = resultados.filter(resultado =>
      resultado.email.toLowerCase().includes(email.toLowerCase())
    );
  }

  // Limitar cantidad de resultados
  if (limit) {
    resultados = resultados.slice(0, parseInt(limit));
  }
  resultados.push(req.url, req.headers)

  res.json(resultados);
});

//Llamar a usuario por su ID, estos ":" hacen que sea dinamico
app.get("/users/:id", (req, res) => {
  //se captura el parametro dinamico que es id
  const id = req.params.id
  //guardamos al usuario que concida con id
  const usuario = db.usuarios.find(usuario => usuario.id === parseInt(id))
  //si no existe se manda el error 404 not found vaina
  if (!usuario) {
    return res.status(400).send("Usuario no encontrado")
  }


  //si existe se manda el usuario
  res.send("Usuario por ID: " + JSON.stringify(usuario, null, 2))
})

//Get para ver los tokens activos
app.get("/users/tokens", (req, res) => {
  if (!tokens.length === 0) {
    return res.status(400).json({ error: "No hay tokens activos" })
  }

  res.json(tokens)
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


app.post("/users", (req, res) => {
  //id automatico creo al igual que la fecha de registro... creo

  const { nombre, email, contraseña } = req.body;

  //Validaciones

  if (!nombre || !email || !contraseña || nombre.trim() === "" || email.trim() === "" || contraseña.trim() === "") {
    return res.status(400).json({ error: "Faltan datos obligatorios" })
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

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`)
})

//metodo POST para iniciar sesion
app.post("/users/login", (req, res) => {
  const { email, contraseña } = req.body
  // validaciones usando el array metod find que nos tira un booleao
  const usuario = db.usuarios.find(usuario => usuario.email === email && usuario.contraseña === contraseña)

  if (!usuario) {
    return res.status(401).json({ error: "Credenciales invalidas" })
  }

  // Generar token simple
  const token = `${usuario.id}-${Date.now()}`;
  tokens.push({ userId: usuario.id, token });

  res.json({ mensaje: "Login exitoso", token });
})

// log out para el usuario
app.post("/users/logout", (req, res) => {


  const { token } = req.body;
  exist = tokens.find(t => t.token === token);
  if (!exist) {
    return res.status(400).json({ error: "Token invalido o ya cerrado sesion" })
  }
  // removemos el token de la lista, al usar el filter
  // esto buscando quien es diferente de la lista de tokens con el token dado en req, y se queda con los que son diferentes
  tokens = tokens.filter(t => t.token !== token);


  res.json({ mensaje: "Logout exitoso" });
})



//Metodo PATCH para actualizar a mis estimados usuariso, ya que me permite actualizar solo lo que yo quiera

app.patch("/users/:id", (req, res) => {
  const id = parseInt(req.params.id)
  const actualizaciones = req.body

  const usuario = db.usuarios.find(usuario => usuario.id === id)
  if (!usuario) {
    return res.status(404).json({ error: "usuario NO encontrado" })
  }


  // Lista de campos que sí se pueden modificar
  const camposPermitidos = ["nombre", "email", "contraseña"];

  // Actualizar solo los campos permitidos
  for (let campo of camposPermitidos) {
    if (camposPermitidos.includes(campo) && actualizaciones[campo].trim() !== "") {
      usuario[campo] = actualizaciones[campo];
    }
  }
  res.status(200).json({ mensaje: "Usuario actualizado exitosamente", usuario })

})
