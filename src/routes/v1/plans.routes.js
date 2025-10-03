const express = require("express")
const router = express.Router()


//importaciones de auth y token
const authMiddleware = require("../../middleware/auth.middleware");
const { login } = require("../../controllers/login.controller");
const { logout } = require("../../controllers/logout.controller");

//controller
const plansController = require("../../controllers/plans.controller")

//POST de login - para autenticar
router.post("/login",login)
//POST desloguearse
router.post("/logout",logout)

//obtener TODOS los planes
router.get("/", authMiddleware, plansController.getPlans)
//Planes por id
router.get("/:id", authMiddleware, plansController.getPlansId)
module.exports = router;


//Post plan
router.post("/", authMiddleware, plansController.postPlan)
//put plan
router.put("/:id", authMiddleware, plansController.putPlans)
//patch plan
router.patch("/:id", authMiddleware, plansController.patchPlans)
//delete plan
router.delete("/:id", authMiddleware, plansController.deletePlans)