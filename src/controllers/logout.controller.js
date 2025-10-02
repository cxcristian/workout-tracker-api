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
  //se recorre tokens y busca la posicion del token, si no lo encuentra paila mano, y tira un menos 1
  const tokenIndex = tokens.indexOf(token);
  //Entonce si la posicion HP sueño... si el indice es mayor a -1 todo melo 
  if (tokenIndex > -1) {
    //si si, entonces va a eliminar el indice de tokens y 1 solo elemento
    tokens.splice(tokenIndex, 1);
  }

  res.json({ mensaje: "Logout exitoso" });
}

//añadir el token a la lista de tokens
function addToken(token) {
  tokens.push(token);
}

// Exportamos
module.exports = { logout, addToken, tokens };
