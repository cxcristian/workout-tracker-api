const jwt = require("jsonwebtoken");
const { db } = require("../db/db");
const { addToken } = require("./logout.controller"); // importar función para guardar token

const SECRET = process.env.JWT_SECRET || "Gato_Super_Negro";

function login(req, res) {
  const { email, contraseña } = req.body;
  const usuario = db.usuarios.find(u => u.email === email && u.contraseña === contraseña);

  if (!usuario) return res.status(401).json({ error: "Credenciales inválidas" });

  // Generar token válido por 1 hora
  const token = jwt.sign({ userId: usuario.id }, SECRET, { expiresIn: "1h" });
    c//onsole.table(token)
  // Guardar token en la lista de tokens activos
  addToken(token);

  res.json({ mensaje: "Login exitoso", token });
}

module.exports = { login };
