const { db } = require("../db/db");


const isUserAuthorizedForPlan = (userId, planId) => {
    const plan = db.planes.find(p => p.id === planId);
    return plan && plan.idUsuario === userId;
};

const getSessions = (req, res) => {
    try {
        const loggedInUserId = req.userId;
        
      
        const userPlans = db.planes.filter(p => p.idUsuario === loggedInUserId);
        const userPlanIds = userPlans.map(p => p.id);

       
        let userSessions = db.sesiones.filter(s => userPlanIds.includes(s.idPlan));

        
        const { idPlan, estado } = req.query;
        if (idPlan) {
            userSessions = userSessions.filter(s => s.idPlan === parseInt(idPlan));
        }
        if (estado) {
            userSessions = userSessions.filter(s => s.estado === estado);
        }

        res.status(200).json(userSessions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener las sesiones." });
    }
};

const getSessionById = (req, res) => {
    try {
        const loggedInUserId = req.userId;
        const sessionId = parseInt(req.params.id);

        const session = db.sesiones.find(s => s.id === sessionId);

        if (!session) {
            return res.status(404).json({ error: "Sesión no encontrada." });
        }

        if (!isUserAuthorizedForPlan(loggedInUserId, session.idPlan)) {
            return res.status(403).json({ error: "No autorizado para acceder a esta sesión." });
        }

        res.status(200).json(session);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener la sesión." });
    }
};

const createSession = (req, res) => {
    try {
        const loggedInUserId = req.userId;
        const { idPlan, fechaHora, estado, observaciones } = req.body;

        if (!idPlan || !fechaHora) {
            return res.status(400).json({ error: "Faltan campos requeridos (idPlan, fechaHora)." });
        }

        if (!isUserAuthorizedForPlan(loggedInUserId, idPlan)) {
            return res.status(403).json({ error: "No autorizado para crear una sesión para este plan." });
        }

        const newSession = {
            id: db.sesiones.length > 0 ? Math.max(...db.sesiones.map(s => s.id)) + 1 : 1,
            idPlan,
            fechaHora,
            estado: estado || 'pendiente',
            observaciones: observaciones || ''
        };

        db.sesiones.push(newSession);
        res.status(201).json(newSession);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear la sesión." });
    }
};

const updateSession = (req, res) => {
    try {
        const loggedInUserId = req.userId;
        const sessionId = parseInt(req.params.id);
        const { idPlan, fechaHora, estado, observaciones } = req.body;

        if (!idPlan || !fechaHora || !estado || !observaciones) {
            return res.status(400).json({ error: "Faltan todos los campos requeridos para la actualización (PUT)." });
        }

        const sessionIndex = db.sesiones.findIndex(s => s.id === sessionId);

        if (sessionIndex === -1) {
            return res.status(404).json({ error: "Sesión no encontrada." });
        }

        const originalSession = db.sesiones[sessionIndex];
        if (!isUserAuthorizedForPlan(loggedInUserId, originalSession.idPlan)) {
            return res.status(403).json({ error: "No autorizado para modificar esta sesión." });
        }
        
        if (idPlan !== originalSession.idPlan && !isUserAuthorizedForPlan(loggedInUserId, idPlan)) {
            return res.status(403).json({ error: "No se puede mover la sesión a un plan que no te pertenece." });
        }

        const updatedSession = { id: sessionId, idPlan, fechaHora, estado, observaciones };
        db.sesiones[sessionIndex] = updatedSession;

        res.status(200).json(updatedSession);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar la sesión." });
    }
};

const patchSession = (req, res) => {
    try {
        const loggedInUserId = req.userId;
        const sessionId = parseInt(req.params.id);
        const updates = req.body;

        const sessionIndex = db.sesiones.findIndex(s => s.id === sessionId);

        if (sessionIndex === -1) {
            return res.status(404).json({ error: "Sesión no encontrada." });
        }

        const originalSession = db.sesiones[sessionIndex];
        if (!isUserAuthorizedForPlan(loggedInUserId, originalSession.idPlan)) {
            return res.status(403).json({ error: "No autorizado para modificar esta sesión." });
        }
        
        // If changing the plan, check authorization for the new plan
        if (updates.idPlan && updates.idPlan !== originalSession.idPlan && !isUserAuthorizedForPlan(loggedInUserId, updates.idPlan)) {
            return res.status(403).json({ error: "No se puede mover la sesión a un plan que no te pertenece." });
        }

        const patchedSession = { ...originalSession, ...updates };
        db.sesiones[sessionIndex] = patchedSession;

        res.status(200).json(patchedSession);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar parcialmente la sesión." });
    }
};

const deleteSession = (req, res) => {
    try {
        const loggedInUserId = req.userId;
        const sessionId = parseInt(req.params.id);

        const sessionIndex = db.sesiones.findIndex(s => s.id === sessionId);

        if (sessionIndex === -1) {
            return res.status(404).json({ error: "Sesión no encontrada." });
        }

        const sessionToDelete = db.sesiones[sessionIndex];
        if (!isUserAuthorizedForPlan(loggedInUserId, sessionToDelete.idPlan)) {
            return res.status(403).json({ error: "No autorizado para eliminar esta sesión." });
        }

        // Remove the session from the array
        db.sesiones.splice(sessionIndex, 1);

        // Respond with a confirmation message and the deleted object
        res.status(200).json({
            mensaje: "Sesión eliminada exitosamente.",
            sesionEliminada: sessionToDelete
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar la sesión." });
    }
};

module.exports = {
    getSessions,
    getSessionById,
    createSession,
    updateSession,
    patchSession,
    deleteSession
};