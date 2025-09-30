//jwt ahora es un jsonwebtoken
const jwt = require("jsonwebtoken");
// clave para firmar y verificar
const SECRET = process.env.JWT_SECRET 
//funcion con una req, res 
function authMiddleware(req, res, next) {
    //pide la autorizacion del header
  const authHeader = req.headers["authorization"];
  //si no hay autorizacion error
  if (!authHeader) return res.status(401).json({ error: "No hay token" });
    //Divide el header en dos partes: "Bearer" y el token real.
   //se queda solo con el token ([1]) para verificarlo.
  const token = authHeader.split(" ")[1]; // "

 //se intenta
  try {
    //verificar si el token es valido y no expirado
    const payload = jwt.verify(token, SECRET);
    req.userId = payload.userId; // información del usuario
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}

module.exports = authMiddleware;