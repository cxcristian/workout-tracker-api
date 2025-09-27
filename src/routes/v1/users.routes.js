const express = require("express");
const router = express.Router();
const usersController = require("../../controllers/users.controller");

// Métodos GET
router.get("/", usersController.getUsers);
router.get("/:id", usersController.getUserById);

// Métodos POST
router.post("/", usersController.createUser);
router.post("/login", usersController.login);
router.post("/logout", usersController.logout);

// PUT / PATCH
router.put("/:id", usersController.updateUser);
router.patch("/:id", usersController.patchUser);

// DELETE
router.delete("/:id", usersController.deleteUser);

module.exports = router;