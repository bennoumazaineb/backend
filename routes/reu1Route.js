const express = require("express");
const { createReunionAndSendEmail} = require("../controller/reuCtrl1");
const router = express.Router();

// Définition des routes pour les tâches
router.post("/reunion", createReunionAndSendEmail);

module.exports = router;