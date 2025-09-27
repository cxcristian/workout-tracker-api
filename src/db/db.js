// Simulación de base de datos en memoria
let tokens = []; // Almacenamiento de tokens

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

module.exports = { db, tokens };
