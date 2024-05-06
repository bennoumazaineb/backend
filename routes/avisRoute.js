const express = require("express");
const { createAvis, getallAvis, deleteAvis} = require("../controller/avisCtrl");
const router = express.Router();

// Définition des routes pour les tâches
router.post("/register", createAvis);
router.get("/all", getallAvis);
router.delete("/:id", deleteAvis);

module.exports = router;