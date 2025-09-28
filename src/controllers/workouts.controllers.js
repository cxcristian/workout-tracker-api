//Importacion de la base de datos simulada
const { db, tokens } = require("../db/db")


//Metodos Get
//obtener a los ejercicios - workouts
const getWorkouts = (req, res)=>{
    const workouts = db.ejercicios
    let resultados = [...workouts]; // copiamos el array original
    res.status(200).json({ 
        data: resultados,
        meta:{
            ulr: req.ulr,
            header: req.headers
        }

    })
}   
module.exports = {
    getWorkouts
}