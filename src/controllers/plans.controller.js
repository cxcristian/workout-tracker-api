const { db } = require("../db/db");

//GET la lista de ejercicios solo si el usuario esta autorizado

const getPlans = (req, res) => {
  try {
    const loggedInUserId = req.userId;
    let resultados = [...db.planes];

    const user = db.usuarios.find((u) => u.id === loggedInUserId);
    if (user && user.nombre !== "admin") {
      resultados = resultados.filter(
        (plan) => plan.idUsuario === loggedInUserId
      );
    }

    const { id, idUsuario, idEjercicio, repeticiones, series, peso } =
      req.query;

    if (id) {
      resultados = resultados.filter((plan) => plan.id === parseInt(id));
    }

    if (idEjercicio) {
      resultados = resultados.filter((plan) =>
        plan.ejercicios.some((ej) => ej.idEjercicio === parseInt(idEjercicio))
      );
    }

    if (repeticiones) {
      resultados = resultados.filter((plan) =>
        plan.ejercicios.some((ej) => ej.repeticiones === parseInt(repeticiones))
      );
    }

    if (series) {
      resultados = resultados.filter((plan) =>
        plan.ejercicios.some((ej) => ej.series === parseInt(series))
      );
    }

    if (peso) {
      resultados = resultados.filter((plan) =>
        plan.ejercicios.some((ej) => ej.peso === peso)
      );
    }

    res.status(200).json(resultados);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los planes." });
  }
};

const getPlansId = (req, res) => {
  const requestId = parseInt(req.params.id);
  const loggedInUserId = req.userId;

  const plans = db.planes.find((plan) => plan.id === requestId);

  if (!plans) {
    return res.status(404).json({
      error: "Ejercicio no encontrado",
      meta: {
        url: req.url,
        headers: req.headers,
      },
    });
  }

  if (parseInt(plans.idUsuario) !== parseInt(loggedInUserId)) {
    return res.status(403).json({
      error: "Acceso denegado. Solo puedes ver tu propia información.",
    });
  }

  res.status(200).json({
    data: plans,
    meta: {
      url: req.url,
    },
  });
};

// post plan

const postPlan = (req, res) => {
  const loggedInUserId = req.userId;
  const { ejercicios } = req.body;

  if (!ejercicios || !Array.isArray(ejercicios) || ejercicios.length === 0) {
    return res
      .status(400)
      .json({ error: "Debes incluir al menos un ejercicio válido" });
  }

  for (let i = 0; i < ejercicios.length; i++) {
    const ej = ejercicios[i];
    const existe = db.ejercicios.find((e) => e.id === ej.idEjercicio);
    if (!existe) {
      return res
        .status(400)
        .json({ error: `El ejercicio con id ${ej.idEjercicio} no existe` });
    }
  }

  const nuevoPlan = {
    id: db.planes.length + 1,
    idUsuario: loggedInUserId,
    ejercicios: ejercicios.map((ej, index) => ({
      id: index + 1,
      ...ej,
    })),
    fechaCreacion: new Date().toISOString(),
  };

  db.planes.push(nuevoPlan);
  res.status(201).json({ mensaje: "Plan creado", data: nuevoPlan });
};

//put
const putPlans = (req, res) => {
  const { id } = req.params;
  const loggedInUserId = req.userId;
  const { ejercicios } = req.body;

  const planIndex = db.planes.findIndex((p) => p.id === parseInt(id));

  if (planIndex === -1)
    return res.status(404).json({ error: "Plan no encontrado" });

  if (db.planes[planIndex].idUsuario !== loggedInUserId) {
    return res
      .status(403)
      .json({ error: "No tienes permiso para modificar este plan" });
  }

  if (!ejercicios || !Array.isArray(ejercicios) || ejercicios.length === 0) {
    return res.status(400).json({ error: "Debes enviar ejercicios válidos" });
  }

  for (let i = 0; i < ejercicios.length; i++) {
    const ej = ejercicios[i];
    const existe = db.ejercicios.find((e) => e.id === ej.idEjercicio);
    if (!existe) {
      return res
        .status(400)
        .json({ error: `El ejercicio con id ${ej.idEjercicio} no existe` });
    }
  }

  db.planes[planIndex] = {
    ...db.planes[planIndex],
    ejercicios: ejercicios.map((ej, index) => ({
      id: index + 1,
      ...ej,
    })),
  };

  res
    .status(200)
    .json({ mensaje: "Plan reemplazado", data: db.planes[planIndex] });
};

//patch
const patchPlans = (req, res) => {
  const { id } = req.params;
  const loggedInUserId = req.userId;
  const { ejercicios } = req.body;

  const plan = db.planes.find((p) => p.id === parseInt(id));
  if (!plan) return res.status(404).json({ error: "Plan no encontrado" });

  if (plan.idUsuario !== loggedInUserId) {
    return res
      .status(403)
      .json({ error: "No tienes permiso para modificar este plan" });
  }

  if (!ejercicios || !Array.isArray(ejercicios)) {
    return res
      .status(400)
      .json({ error: "Debes enviar un array de ejercicios" });
  }

  ejercicios.forEach((ej) => {
    if (ej.id) {
      
      const index = plan.ejercicios.findIndex((e) => e.id === ej.id);
      if (index !== -1) {
        plan.ejercicios[index] = { ...plan.ejercicios[index], ...ej };
      } else {
        return res
          .status(400)
          .json({ error: `No existe un ejercicio con id interno ${ej.id}` });
      }
    } else {
      const nuevoId =
        plan.ejercicios.length > 0
          ? Math.max(...plan.ejercicios.map((e) => e.id)) + 1
          : 1;
      plan.ejercicios.push({ id: nuevoId, ...ej });
    }
  });

  res
    .status(200)
    .json({ mensaje: "Plan actualizado parcialmente", data: plan });
};
//Delete
const deletePlans = (req, res) => {
  const { id } = req.params;
  const planIndex = db.planes.findIndex((p) => p.id === parseInt(id));
  const loggedInUserId = req.userId;

  if (planIndex === -1) {
    return res.status(404).json({ error: "Plan no encontrado" });
  }

  if (db.planes[planIndex].idUsuario !== loggedInUserId) {
    return res
      .status(403)
      .json({ error: "No tienes permiso para eliminar este plan" });
  }

  const eliminado = db.planes.splice(planIndex, 1);

  res.status(200).json({
    mensaje: "Plan eliminado",
    data: eliminado[0],
  });
};



module.exports = {
  getPlans,
  getPlansId,
  postPlan,
  putPlans,
  patchPlans,
  deletePlans,
};
