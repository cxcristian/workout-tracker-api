const express = require("express")
const router = express.Router()

const authMiddleware = require("../../middleware/auth.middleware")
const { login } = require("../../controllers/login.controller");
const { logout } = require("../../controllers/logout.controller");

const sessionsController = require("../../controllers/sessions.controller");


router.post("/login", login)
router.post("/logout", authMiddleware, logout)

router.get("/", authMiddleware, sessionsController.getSessions)
router.get("/:id", authMiddleware, sessionsController.getSessionById)

router.post("/", authMiddleware, sessionsController.createSession)
router.put("/:id", authMiddleware, sessionsController.updateSession)
router.patch("/:id", authMiddleware, sessionsController.patchSession)
router.delete("/:id", authMiddleware, sessionsController.deleteSession)


module.exports = router