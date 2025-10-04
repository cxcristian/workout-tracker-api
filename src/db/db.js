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
    },
    {
      id: 3,
      nombre: "admin",
      email: "admin@mail.com",
      contraseña: "123",
      fechaRegistro: "2025-09-10T08:30:00Z"
    },
    {
      id: 4,
      nombre: "Valentina",
      email: "valen@mail.com",
      contraseña: "valen2025",
      fechaRegistro: "2025-09-22T14:45:00Z"
    },
    {
      id: 5,
      nombre: "Andrés",
      email: "andres@mail.com",
      contraseña: "pass123",
      fechaRegistro: "2025-09-05T09:15:00Z"
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
    },
    {
      id: 3,
      nombre: "Peso muerto",
      descripcion: "Trabajo de espalda y piernas con barra",
      categoria: "Espalda"
    },
    {
      id: 4,
      nombre: "Dominadas",
      descripcion: "Ejercicio con barra fija para espalda",
      categoria: "Espalda"
    },
    {
      id: 5,
      nombre: "Curl de bíceps",
      descripcion: "Trabajo de brazos con mancuernas",
      categoria: "Brazos"
    }
  ],

  planes: [
    {
      id: 1,
      idUsuario: 1,
      ejercicios: [
        { id:1,idEjercicio: 1, repeticiones: 12, series: 4, peso: "40kg" },
        {id:2, idEjercicio: 2, repeticiones: 10, series: 3, peso: "30kg" }
      ],
      fechaCreacion: "2025-09-15T09:00:00Z"
    },
    {
      id: 2,
      idUsuario: 2,
      ejercicios: [
        { id:1,idEjercicio: 3, repeticiones: 8, series: 5, peso: "70kg" },
        { id:2,idEjercicio: 5, repeticiones: 15, series: 3, peso: "15kg" }
      ],
      fechaCreacion: "2025-09-16T11:00:00Z"
    },
    
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
    },
    {
      id: 3,
      idPlan: 2,
      fechaHora: "2025-09-21T07:00:00Z",
      estado: "pendiente",
      observaciones: "Primera sesión del plan de Santiago"
    },
    {
      id: 4,
      idPlan: 2,
      fechaHora: "2025-09-19T19:00:00Z",
      estado: "completado",
      observaciones: "Entrenamiento fuerte de espalda y brazos"
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
    },
    {
      id: 2,
      idUsuario: 2,
      rangoFechas: "2025-09-01 a 2025-09-19",
      estadisticas: {
        ejerciciosCompletados: 20,
        totalSeries: 75,
        totalRepeticiones: 800
      },
      resumen: "Buen progreso en fuerza y constancia"
    },
    {
      id: 3,
      idUsuario: 3,
      rangoFechas: "2025-09-10 a 2025-09-19",
      estadisticas: {
        ejerciciosCompletados: 5,
        totalSeries: 20,
        totalRepeticiones: 200
      },
      resumen: "Actividad baja, necesita más disciplina"
    }
  ]
};

module.exports = { db }; 