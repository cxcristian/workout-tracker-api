const express = require('express');
const app = express();
const { port } = require('./config/env')

const routes = require('./routes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
// Montar las rutas principales
app.use("/api", routes);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});