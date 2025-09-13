//dotenv permite cargar varibles de entorno desde un archivo .env a procce.env
//por lo que al nuestro .env tener datos sensibles, no va a afectar nuestra seguridad
require('dotenv').config();
//exportacion del modulo para todo nuestro proyecto
module.exports = {
  port: process.env.PORT || 3000,
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  }
};