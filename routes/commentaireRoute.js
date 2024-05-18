const express = require("express");
const { createCommentaire, getallCommentaire, deleteCommentaire} = require("../controller/commentaireCtrl");
const router = express.Router();

// Définition des routes pour les tâches
router.post("/register", createCommentaire);
router.get("/all", getallCommentaire);
router.delete("/:id", deleteCommentaire);

module.exports = router;