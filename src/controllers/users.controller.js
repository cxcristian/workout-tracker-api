//Importacion de la base de datos simulada
const { db } = require("../db/db")


// -------------------         
// Métodos GET
// -------------------

// GET /v1/users - obtener todos los usuarios con filtros
const getUsers = (req, res) => {
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

    // Si no hay resultados
    if (resultados.length === 0) {
        return res.status(400).json({
            ok: false,
            message: "No se encontraron usuarios con los criterios dados"
        });
    }

    return res.status(200).json({
        success: true,
        total: resultados.length,
        data: resultados,
        meta: {
            url: req.url,
            headers: req.headers
        }
    });
};

// GET /v1/users/:id - obtener usuario por ID - solo si es él
const getUserById = (req, res) => {
    // ID del usuario que se quiere obtener (de la URL)
    const requestedId = parseInt(req.params.id);
    // ID del usuario que está logueado (del token JWT)
    const loggedInUserId = req.userId;

    // --- Verificación de Autorización ---
    if (requestedId !== loggedInUserId) {
        return res.status(403).json({ error: "Acceso denegado. Solo puedes ver tu propia información." });
    }

    const user = db.usuarios.find(u => u.id === requestedId);

    if (!user) {
        return res.status(404).json({
            error: "Usuario no encontrado",
            meta: {
                url: req.url,
                headers: req.headers
            }
        });
    }

    res.status(200).json({
        data: user,
        meta: {
            url: req.url,
            headers: req.headers
        }
    });
};

// -------------------
// Métodos POST
// -------------------

// POST /v1/users - crear usuario
const createUser = (req, res) => {
    const { nombre, email, contraseña } = req.body;

    const camposObligatorios = ["nombre", "email", "contraseña"];

    for (const campo of camposObligatorios) {
        if (!req.body[campo]) {
            return res.status(400).json({
                error: "El campo " + campo + " es obligatorio",
                meta: {
                    url: req.url,
                    headers: req.headers
                }
            });
        }
    }

    const nuevoUsuario = {
        id: db.usuarios.length + 1,
        nombre,
        email,
        contraseña,
        fechaRegistro: new Date().toISOString()
    };

    db.usuarios.push(nuevoUsuario);

    res.status(201).json({
        message: "Usuario creado exitosamente",
        data: nuevoUsuario,
        meta: {
            url: req.url,
            headers: req.headers
        }
    });
};
/*
// POST /v1/users/login - iniciar sesión
const login = (req, res) => {
    const { email, contraseña } = req.body;

    const usuario = db.usuarios.find(
        usuario => usuario.email === email && usuario.contraseña === contraseña
    );

    if (!usuario) {
        return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Generar token simple
    const token = `${usuario.id}-${Date.now()}`;
    tokens.push({ userId: usuario.id, token });

    res.json({ mensaje: "Login exitoso", token });
};*/

// POST /v1/users/logout - cerrar sesión
/*
const logout = (req, res) => {
    const { token } = req.body;
    const exist = tokens.find(t => t.token === token);

    if (!exist) {
        return res.status(400).json({ error: "Token inválido o ya cerró sesión" });
    }

    // eliminar el token
    tokens = tokens.filter(t => t.token !== token);

    res.json({ mensaje: "Logout exitoso" });
};*/

// -------------------
// Métodos PUT / PATCH
// -------------------

// PUT /v1/users/:id - actualizar usuario completo
const updateUser = (req, res) => {
    const { id } = req.params;
    const { nombre, email, contraseña } = req.body;

    const loggedInUserId = req.userId;
    // --- Verificación de Autorización ---
    if (parseInt(id) !== parseInt(loggedInUserId)) {
        return res.status(403).json({ error: "Acceso denegado. Solo puedes Actualizar tu información." });
    }
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

    if (!nombre || !email) {
        return res.status(400).json({
            error: "Datos faltantes (nombre y email son obligatorios)",
            meta: {
                url: req.url,
                headers: req.headers
            }
        });
    }

    db.usuarios[index] = {
        ...db.usuarios[index],
        nombre,
        email,
        contraseña
    };

    return res.status(200).json({
        message: "Usuario actualizado correctamente",
        data: db.usuarios[index],
        meta: {
            url: req.url,
            headers: req.headers
        }
    });
};

// PATCH /v1/users/:id - actualización parcial
const patchUser = (req, res) => {
    const id = parseInt(req.params.id);
    const actualizaciones = req.body;

    const loggedInUserId = req.userId;
    // --- Verificación de Autorización ---
    if (parseInt(id) !== parseInt(loggedInUserId)) {
        return res.status(403).json({ error: "Acceso denegado. Solo puedes Actualizar tu información." });
    }

    const usuario = db.usuarios.find(usuario => usuario.id === id);

    if (!usuario) {
        return res.status(404).json({ error: "Usuario NO encontrado" });
    }

    const camposPermitidos = ["nombre", "email", "contraseña"];

    for (let campo of camposPermitidos) {
        if (
            actualizaciones[campo] &&
            actualizaciones[campo].trim() !== ""
        ) {
            usuario[campo] = actualizaciones[campo];
        }
    }

    res.status(200).json({
        mensaje: "Usuario actualizado exitosamente",
        usuario
    });
};

// -------------------
// Método DELETE
// -------------------

const deleteUser = (req, res) => {
    const { id } = req.params;

    const loggedInUserId = req.userId;
    // --- Verificación de Autorización ---
    if (parseInt(id) !== parseInt(loggedInUserId)) {
        return res.status(403).json({ error: "Acceso denegado. No eres el dueño de este usuario." });
    }

    const index = db.usuarios.findIndex(u => u.id === parseInt(id));

    

    if (index === -1) {
        return res.status(404).json({ error: "Usuario no encontrado mano" });
    }

    const eliminado = db.usuarios.splice(index, 1);

    res.status(200).json({
        borrado: eliminado,
        meta: {
            url: req.url,
            headers: req.headers
        }
    });
};

// -------------------
// Exportación CommonJS
// -------------------

module.exports = {
    getUsers,
    getUserById,
    createUser,
    
    updateUser,
    patchUser,
    deleteUser
};