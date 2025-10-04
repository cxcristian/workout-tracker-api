const express = require("express");
const router = express.Router();

//controller
const plansController = require("../../controllers/plans.controller");

//obtener TODOS los planes
router.get("/", plansController.getPlans);
//Planes por id
router.get("/:id", plansController.getPlansId);


//Post plan
router.post("/", plansController.postPlan);
//put plan
router.put("/:id", plansController.putPlans);
//patch plan
router.patch("/:id", plansController.patchPlans);
//delete plan
router.delete("/:id", plansController.deletePlans);
module.exports = router;