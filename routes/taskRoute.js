const express = require("express");
const { createTask, getalTask, getaTask,getTasksByProject, deleteTask, updateaTask,updateTaskEtat,updateTaskRemarque,updateTaskEmployee } = require("../controller/taskCtrl");
const router = express.Router();

// Définition des routes pour les tâches
router.post("/register", createTask);
router.get("/all-tasks", getalTask);
// Route spécifique pour récupérer les tâches par projet
router.get('/project', getTasksByProject);
router.get("/:id", getaTask);
router.delete("/:id", deleteTask);
router.put("/:id", updateaTask);
router.put('/update-Etat/:id',updateTaskEtat);
router.put('/update-rq/:id',updateTaskRemarque);
router.put('/update-employee/:id', updateTaskEmployee);
// Route pour récupérer les tâches terminées par mois

module.exports = router;
