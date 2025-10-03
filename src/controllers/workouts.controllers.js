//Importacion de la base de datos simulada
const { db } = require("../db/db")


//Metodos Get
//obtener a los ejercicios - workouts - no usar
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


//Obtener los ejercicios por el id
const getWorkoutsById =(req,res)=>{
    //id logueado
    const loggedId = req.userId
    //id solicitado
    const requestId = parseInt(req.params.id)
    //Validacion o auth para ver si la persona puede acceder a ese recurso
    if(loggedId !== requestId){
        return res.status(403).json({error: "Acceso denegado. NO es tu informacion"})
    }

    const workout = db.ejercicios.find(ejercicio => ejercicio.id === requestId)

    //Si dicho ejercicio no existe entonces 
    if(!workout){
        return res.status(404).json({error: "Ejercicio no encontrado",
            meta:{
                url: req.url,
                headers: req.headers
            }
        })
    }
    //La vaina fu encontrada
    res.status(200).json({data: workout,
        meta:{
            url: req.url,
            headers: req.headers
        }
    })

}
module.exports = {
    getWorkouts,
    getWorkoutsById

}