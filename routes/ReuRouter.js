const express = require("express");
const { createReunion, getAllReus, deleteReu, updateReu ,getaReu,updatePropositionRefusedToAccepted} = require("../controller/reuCtrl");
const router = express.Router();

// Définition des routes pour les tâches
router.post("/Add-reu", createReunion);
router.get("/all-reu", getAllReus);
router.get("/GetAReu/:id",getaReu);
router.delete("/:id", deleteReu);
router.put("/:id", updateReu);
// Route pour mettre à jour le statut d'une proposition de 'refusé' à 'accepté'
router.put('/propositions/:id', updatePropositionRefusedToAccepted);
module.exports = router;