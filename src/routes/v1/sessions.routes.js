const express = require("express")
const router = express.Router()

const sessionsController = require("../../controllers/sessions.controller");


router.get("/", sessionsController.getSessions)
router.get("/:id",  sessionsController.getSessionById)

router.post("/",  sessionsController.createSession)
router.put("/:id", sessionsController.updateSession)
router.patch("/:id",  sessionsController.patchSession)
router.delete("/:id",  sessionsController.deleteSession)

module.exports = router