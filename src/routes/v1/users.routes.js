const express = require("express");
const router = express.Router();
//controllers
const {login} = require("../../controllers/login.controller");
const {logout} = require("../../controllers/logout.controller")
const usersController = require("../../controllers/users.controller");
//middlewares  - auth 
const authMiddleware = require("../../middleware/auth.middleware")



//=================================
// Métodos GET                    ||
//=================================
router.get("/", authMiddleware,usersController.getUsers);
router.get("/:id", authMiddleware, usersController.getUserById);

// Métodos POST
//=====================
//crear usuario - no necesita verificacion de id
router.post("/", authMiddleware, usersController.createUser);
//loguearse tampoco
router.post("/login", login);
//cerrar sesion menos
router.post("/logout",authMiddleware ,logout);

// PUT / PATCH
//=====================
// actualizar 
router.put("/:id", authMiddleware, usersController.updateUser);
router.patch("/:id", authMiddleware, usersController.patchUser);

// DELETE
router.delete("/:id", authMiddleware, usersController.deleteUser);

module.exports = router;