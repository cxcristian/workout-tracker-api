// Array en memoria que guarda tokens activos
let tokens = []; // esto creo que no es lo legal y optimo pero ya que

function logout(req, res) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(400).json({ error: "No hay token" });
  }

  // Separar "Bearer" y el token real
  const token = authHeader.split(" ")[1];

  // Eliminar token de la lista de tokens activos
  tokens = tokens.filter(t => t !== token);

  res.json({ mensaje: "Logout exitoso" });
}

// Opcional: función para agregar token al login
function addToken(token) {
  tokens.push(token);
}

// Exportamos
module.exports = { logout, addToken, tokens };
