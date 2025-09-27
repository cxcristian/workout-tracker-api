const express = require("express")
//se crea una instncia de router,importamos la clase Router
const router = express.Router()

//importacion de la simulacion de base de datos
const { db, tokens } = require("../../db/db")
//console.table(db.usuarios)


// Metodos Get
// get /v1/users - obtener todos los usuarios, con filtros
router.get("/", (req, res) => {
   const usuarios = db.usuarios;

   let resultados = [...usuarios]; // copiamos el array original

   const { nombre, email, limit } = req.query;

   // Filtro por nombre
   if (nombre) {
      resultados = resultados.filter(u =>
         u.nombre.toLowerCase().includes(nombre.toLowerCase())
      );
   }

   // Filtro por email
   if (email) {
      resultados = resultados.filter(u =>
         u.email.toLowerCase().includes(email.toLowerCase())
      );
   }

   // Limitamos cantidad
   if (limit) {
      resultados = resultados.slice(0, parseInt(limit));
   }

   // Si no hay resultados, devolver error
   if (resultados.length === 0) {
      return res.status(400).json({
         ok: false,
         message: "No se encontraron usuarios con los criterios dados"
      });
   }


   // Respondemos con status + data, si funciona
   return res.status(200).json({
      success: true,
      total: resultados.length,
      data: resultados,
      meta: {
         url: req.url,
         headers: req.headers
      }
   });
});

router.get("/:id", (req, res) => {
   const { id } = req.params
   const user = db.usuarios.find(u => u.id === parseInt(id))


   if (!user) {
      return res.status(404).json({
         error: "usuario no encontrado",
         meta: {
            url: req.url,
            headers: req.headers
         }
      })
   }
   res.status(200).json({
      data: user,
      meta: {
         url: req.url,
         headers: req.headers
      }
   }
   )
})


// Metodos POST 

router.post("/", (req, res) => {
   //datos que se deben enviar en la request
   const { nombre, email, contraseña } = req.body
   //validacion de datos
   const camposObligatorios = ["nombre", "email", "contraseña"]
   //bucle validaroio 
   // en caso de que yo no quiera decir que campo falta, pues quito campo xd
   for (const campo of camposObligatorios) {
      if (!req.body[campo]) {
         return res.status(400).json({
            error: "El campo " + campo + " es obligatorio",
            meta: {
               url: req.url,
               headers: req.headers
            }
         })
      }
   }
   //le damos los datos al nuevo usuaio
   const nuevoUsuario = {
      id: db.usuarios.length + 1,
      nombre,
      email,
      contraseña,
      fechaRegistro: new Date().toISOString()
   }
   // se ""Guarda en la bloginase de datos""
   db.usuarios.push(nuevoUsuario)
   res.status(201).json({
      message: "Usuario creado exitosamente",
      data: nuevoUsuario,
      meta: {
         url: req.url,
         headers: req.headers
      }
   })
})


//metodo POST para iniciar sesion
router.post("/", (req, res) => {
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
router.post("/logout", (req, res) => {


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


//PUT 

router.put("/:id", (req, res) => {
   const { id } = req.params;
   const { nombre, email, contraseña } = req.body;

   // Buscar usuario por ID
   const index = db.usuarios.findIndex(u => u.id === parseInt(id));

   if (index === -1) {
      return res.status(404).json({
         error: "Usuario no encontrado",
         meta: {
            url: req.url,
            headers: req.headers
         }
      });
   }

   // Validar datos obligatorios
   if (!nombre || !email) {
      return res.status(400).json({
         error: "Datos faltantes (nombre y email son obligatorios)",
         meta: {
            url: req.url,
            headers: req.headers
         }
      });
   }

   // Actualizar el usuario manteniendo lo previo
   db.usuarios[index] = {
      ...db.usuarios[index],
      nombre,
      email,
      contraseña
   };

   return res.status(200).json({
      message: "Usuario actualizado correctamente",
      data: db.usuarios[index]
      ,
      meta: {
         ulr: req.url,
         header: req.headers
      }
   });
});


router.delete("/:id", (req, res)=>{
   const {id} = req.params
      const index = db.usuarios.findIndex(u => u.id === parseInt(id));

   if (index === -1) {                                   
    return res.status(404).json({ error: 'Usuario no encontrado mano' });
  }
  const eliminado = db.usuarios.splice(index, 1)
  res.status(200).json({
   borrado: eliminado,
   meta: {
      url: req.url, header: req.headers
   }
  }

  )
})

//patch
router.patch("/:id", (req, res) => {
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
//exportacion con common js
module.exports = router;