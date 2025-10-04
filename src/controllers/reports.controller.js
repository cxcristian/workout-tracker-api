const { db } = require("../db/db");

const generateReport = (req, res) => {
    try {
        const loggedInUserId = req.userId;
        const { fechaInicio, fechaFin } = req.body;

        if (!fechaInicio || !fechaFin) {
            return res.status(400).json({ error: "Faltan fechaInicio y fechaFin en el cuerpo de la solicitud." });
        }

        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);

        // 1. Get user's plans
        const userPlans = db.planes.filter(p => p.idUsuario === loggedInUserId);
        const userPlanIds = userPlans.map(p => p.id);

        // 2. Filter completed sessions within the date range
        const relevantSessions = db.sesiones.filter(s => 
            userPlanIds.includes(s.idPlan) &&
            s.estado === 'completado' &&
            new Date(s.fechaHora) >= inicio &&
            new Date(s.fechaHora) <= fin
        );

        if (relevantSessions.length === 0) {
            return res.status(404).json({ mensaje: "No se encontraron sesiones completadas en el rango de fechas especificado." });
        }

        // 3. Calculate statistics
        let stats = {
            ejerciciosCompletados: 0,
            totalSeries: 0,
            totalRepeticiones: 0
        };

        relevantSessions.forEach(session => {
            const plan = userPlans.find(p => p.id === session.idPlan);
            if (plan) {
                stats.ejerciciosCompletados += plan.ejercicios.length;
                plan.ejercicios.forEach(ejercicio => {
                    stats.totalSeries += ejercicio.series;
                    stats.totalRepeticiones += ejercicio.repeticiones;
                });
            }
        });

        // 4. Create new report object
        const newReport = {
            id: db.reportes.length > 0 ? Math.max(...db.reportes.map(r => r.id)) + 1 : 1,
            idUsuario: loggedInUserId,
            rangoFechas: `${fechaInicio} a ${fechaFin}`,
            estadisticas: stats,
            resumen: `Reporte generado para el período del ${fechaInicio} al ${fechaFin}.` // Placeholder summary
        };

        db.reportes.push(newReport);

        res.status(201).json(newReport);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al generar el reporte." });
    }
};

const getReports = (req, res) => {
    try {
        const loggedInUserId = req.userId;
        const userReports = db.reportes.filter(r => r.idUsuario === loggedInUserId);
        res.status(200).json(userReports);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener los reportes." });
    }
};

const getReportById = (req, res) => {
    try {
        const loggedInUserId = req.userId;
        const reportId = parseInt(req.params.id);

        const report = db.reportes.find(r => r.id === reportId);

        if (!report) {
            return res.status(404).json({ error: "Reporte no encontrado." });
        }

        if (report.idUsuario !== loggedInUserId) {
            return res.status(403).json({ error: "No autorizado para acceder a este reporte." });
        }

        res.status(200).json(report);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener el reporte." });
    }
};

module.exports = {
    generateReport,
    getReports,
    getReportById
};