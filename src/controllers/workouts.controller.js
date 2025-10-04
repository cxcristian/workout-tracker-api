//Importacion de la base de datos simulada
const { db } = require("../db/db");

//Metodos Get
//obtener a los ejercicios - workouts -
const getWorkouts = (req, res) => {
  const workouts = db.ejercicios;
  let resultados = [...workouts]; // copiamos el array original

  const { id, nombre, descripcion, categoria } = req.query;

  //filtro por id
  if (id) {
    resultados = resultados.filter((u) =>
      u.id.toLowerCase().includes(id.toLowerCase())
    );
  }
  //filtro por nombre

  if (nombre) {
    resultados = resultados.filter((u) =>
      u.nombre.toLowerCase().includes(nombre.toLowerCase())
    );
  }
  //filtro por descripcion
  if (descripcion) {
    resultados = resultados.filter((u) =>
      u.descripcion.toLowerCase().includes(descripcion.toLowerCase())
    );
  }
  //filtro por categoria
  if (categoria) {
    resultados = resultados.filter((u) =>
      u.categoria.toLowerCase().includes(categoria.toLowerCase())
    );
  }

  // SI resultados no tiene nada
  if (resultados.length === 0) {
    return res.status(404).json({
      error: "No se encontraron ejercicios con los criterios dados",

      meta: {
        url: req.url,
        headers: req.headers,
      },
    });
  }

  res.status(200).json({
    mensaje: "Ejercicios encontrados",
    data: resultados,
    meta: {
      ulr: req.ulr,
      header: req.headers,
    },
  });
};

//Obtener los ejercicios por el id
const getWorkoutsById = (req, res) => {
  const requestId = parseInt(req.params.id);

  //id solicitado
  /*
    const loggedId = req.userId
    //Validacion o auth para ver si la persona puede acceder a ese recurso
    if(loggedId !== requestId){
        return res.status(403).json({error: "Acceso denegado. NO es tu informacion"})
    }*/ //Esta validacion no tiene sentido, ya que se deberian no hay problema de que la gente vea los ejercicios.

  const workout = db.ejercicios.find((ejercicio) => ejercicio.id === requestId);

  //Si dicho ejercicio no existe entonces
  if (!workout) {
    return res.status(404).json({
      error: "Ejercicio no encontrado",
      meta: {
        url: req.url,
        headers: req.headers,
      },
    });
  }
  //La vaina fu encontrada
  res.status(200).json({
    data: workout,
    meta: {
      url: req.url,
      headers: req.headers,
    },
  });
};

//Crear un ejeercicio  o workout
const createWorkout = (req, res) => {
  const { nombre, descripcion, categoria } = req.body;
  const camposObligatorios = ["nombre", "descripcion", "categoria"];

  //validacion
  for (const campo of camposObligatorios) {
    if (!req.body[campo]) {
      return res.status(400).json({
        error: "El campo " + campo + " es obligatorio",
        meta: {
          url: req.url,
          headers: req.headers,
        },
      });
    }
  }

  // nuevo ejercicio objeto literal
  const nuevoEjercicio = {
    id: db.ejercicios.length + 1,
    nombre,
    descripcion,
    categoria,
  };
  db.ejercicios.push(nuevoEjercicio);

  res.status(201).json({
    mensaje: "Ejercicio creado exitosamente",
    data: nuevoEjercicio,
    meta: {
      url: req.url,
      headers: req.headers,
    },
  });
};
//update PUT
const updateWorkout = (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, categoria } = req.body;
  // encontrar la posicion del ejercicio que se desea cambiar
  const index = db.ejercicios.findIndex(
    (ejercicio) => ejercicio.id === parseInt(id)
  );
  //si no lo encuentra
  if (index === -1) {
    return res.status(404).json({
      error: "Ejercicio no encontrado",
      meta: {
        url: req.url,
        headers: req.headers,
      },
    });
  }
  //si lo encuentra valida que en el body tenga la info

  if (!nombre || !descripcion || !categoria) {
    return res.status(400).json({
      error: "Faltan campos obligatorios",
      //pa que le voy a decir?
    });
  }
  db.ejercicios[index] = {
    //copiamos todo del viejo objeto
    ...db.ejercicios[index],
    nombre,
    descripcion,
    categoria,
  };
  return res.status(200).json({
    mensaje: "actualizacion completa",
    data: db.ejercicios[index],
    meta: {
      url: req.url,
      headers: req.headers,
    },
  });
};
//patch
const patchWorkout = (req, res) => {
  const { id } = req.params;
  const actualizaciones = req.body;
  const camposPermitidos = ["nombre", "descripcion", "categoria"];

  //busca el ejercicio
  const workout = db.ejercicios.find(
    (ejercicio) => ejercicio.id === parseInt(id)
  );

  if (!workout) {
    return res.status(404).json({
      error: "Ejercicio no encontrado",
      meta: {
        url: req.url,
        headers: req.headers,
      },
    });
  }

  for(let campo of camposPermitidos){
    if(actualizaciones[campo] && actualizaciones[campo].trim() !== ""){
        workout[campo] = actualizaciones[campo];
    }
  }
  res.status(200).json({
    mensaje: "Actualizacion realizada",
    data: workout,
    meta: {
      url: req.url
      
    },
  });
};

//Deleto

const deleteWorkout = (req, res) =>{
    const {id} = req.params

    const index = db.ejercicios.findIndex(u => u.id === parseInt(id))
    if(index === -1){
        return res.status(404).json({
            error: "Ejercicio no encontrado"
        
        })
    }
     const eliminado = db.ejercicios.splice(index, 1);

     res.status(200).json({
        mensaje: "Ejercicio eliminado",
        data: eliminado
     })

}

module.exports = {
  getWorkouts,
  getWorkoutsById,
  createWorkout,
  updateWorkout,
  patchWorkout,
  deleteWorkout
};
