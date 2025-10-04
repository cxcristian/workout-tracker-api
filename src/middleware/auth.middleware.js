const jwt = require("jsonwebtoken");
const { tokens } = require("../controllers/logout.controller"); // lista de tokens activos

// Clave secreta para firmar/verificar tokens
const SECRET = process.env.JWT_SECRET || "Gato_Super_Negro";

/**
 * Middleware de autenticación
 * - Verifica que la petición tenga un token JWT válido.
 * - Asigna req.userId con el id del usuario logueado.
 * - Si el token no es válido, está expirado o fue logout, devuelve 401.
 */
function authMiddleware(req, res, next) {
  
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "No hay token de autorización" });
  }

  const token = authHeader.split(" ")[1];

  // Verificar que el token siga activo
  if (!tokens.includes(token)) {
    return res.status(401).json({ error: "Token inválido o cerrado sesión" });
  }

  try {
    // rdyr rl token que nos dio login
    const payload = jwt.verify(token, SECRET);

    // Ahora sacamos el id que se le dio en el login y con eso verificaremos que el usuari
    //acceda a su datos [NOTA: Si esto es cualquier peticion y va a un controller este user
    // id se pasaria como una nueva propiedad al objeto req, aun no lo tengo muy en claro pero bue
    // y ya de ahi podemos hacer uso de esta misma]
    req.userId = payload.userId;

    next(); // continuar al siguiente middleware o controller
  } catch (err) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}


module.exports = authMiddleware;

