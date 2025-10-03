const jwt = require("jsonwebtoken");
const { addToken } = require("../controllers/logout.controller");
const {db} = require("../db/db");

const SECRET = process.env.JWT_SECRET || "Gato_Super_Negro";

const login = (req, res) => {
  const { email, contraseña } = req.body;

  if (!email || !contraseña) {
        return res.status(400).send({ status: "error", message: "Faltan email o contraseña" });
    }
    // Validar credenciales
  const usuario = db.usuarios.find(u => u.email === email && u.contraseña === contraseña);
  
  if (!usuario) return res.status(401).json({ error: "Credenciales inválidas" });

  // Generar token válido por 1 hora
  const token = jwt.sign({ userId: usuario.id }, SECRET, { expiresIn: "1h" });
    //onsole.table(token)
  // Guardar token en la lista de tokens activos
  addToken(token);

  

  res.json({ mensaje: "Login exitoso", token: token });
}

module.exports = { login };