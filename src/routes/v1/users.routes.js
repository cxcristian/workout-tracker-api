const express = require("express");
const router = express.Router();
//controllers

const usersController = require("../../controllers/users.controller");
//middlewares  - auth 




//=================================
// Métodos GET                    ||
//=================================
router.get("/",usersController.getUsers);
router.get("/:id", usersController.getUserById);

// Métodos POST
//=====================
//crear usuario - no necesita verificacion de id
router.post("/", usersController.createUser);


// PUT / PATCH
//=====================
// actualizar 
router.put("/:id", usersController.updateUser);
router.patch("/:id", usersController.patchUser);

// DELETE
router.delete("/:id", usersController.deleteUser);

module.exports = router;