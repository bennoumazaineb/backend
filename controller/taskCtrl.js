const asyncHandler = require("express-async-handler");
const Task = require("../models/taskModel");

const createTask = asyncHandler(async (req, res) => {
  const Titre = req.body.Titre;
  const findTask = await Task.findOne({ Titre: Titre });
  
  if (!findTask) {
    const newTask = await Task.create(req.body);
    res.json(newTask);
  } else {
    throw new Error("Task Already Exists");
  }
});


  

const updateaTask = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
        
        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }
        
        res.json(updatedTask);
    } catch (error) {
        throw new Error(error.message);
    }
});

const getalTask = asyncHandler(async (req, res) => {
    try {
        // Récupérer toutes les tâches sans pagination
        const tasks = await Task.find().populate("Employe");
        res.json(tasks);
    } catch (error) {
        throw new Error(error.message);
    }
});


const getaTask = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id).populate("Employe");
        
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        
        res.json(task);
    } catch (error) {
        throw new Error(error.message);
    }
});


const deleteTask = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTask = await Task.findByIdAndDelete(id);
        
        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }
        
        res.json({ message: "Task deleted successfully", deletedTask });
    } catch (error) {
        throw new Error(error.message);
    }
});

const updateTaskRemarque = async (req, res) => {
    const id = req.params.id;
    const { remarque } = req.body;
  
    try {
      const updatdTask = await Task.findByIdAndUpdate(id, { Remarque: remarque }, { new: true });
  
      if (!updatdTask) {
        return res.status(404).json({ message: 'Tâche non trouvée' });
      }
  
      res.status(200).json(updatdTask);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur ' });
      $
    }
  };

  const updateTaskEtat = async (req, res) => {
    const id = req.params.id;
    const { etat } = req.body;
  
    try {
      const updateTask = await Task.findByIdAndUpdate(id, { Etat: etat }, { new: true });
  
      if (!updateTask) {
        return res.status(404).json({ message: 'Tâche non trouvée' });
      }
  
      res.status(200).json(updateTask);
    } catch (error) {
      console.error(error);
      res.status(500).json({message: 'Erreur'});
    }
  };
  const updateTaskEmployee = async (req, res) => {
    const id = req.params.id;
    const { employe } = req.body;
  console.log(id,employe)
    try {
      const updateTask = await Task.findByIdAndUpdate(id, { Employe: employe }, { new: true });
  
      if (!updateTask) {
        return res.status(404).json({ message: 'Tâche non trouvée' });
      }
  
      res.status(200).json(updateTask);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur' });
    }
  };
  
  const getTasksByProject = asyncHandler(async (req, res) => {
    try {
      // Récupérer toutes les tâches de la base de données avec le champ Projet
      const allTasks = await Task.find().populate('project');
    
      if (allTasks.length === 0) {
        return res.status(404).json({ message: 'Aucune tâche trouvée dans la base de données' });
      }
    
      // Créer un objet pour regrouper les tâches par projet
      const tasksByProject = {};
    
      // Parcourir toutes les tâches pour regrouper par projet
      allTasks.forEach(task => {
        const projectName = task.project; // Utiliser la propriété project au lieu de Projet
    
        if (!tasksByProject[projectName]) {
          // Initialiser un tableau vide pour stocker les tâches de ce projet
          tasksByProject[projectName] = [];
        }
    
        // Ajouter la tâche au tableau correspondant au projet
        tasksByProject[projectName].push(task);
      });
    
      // Créer la réponse JSON avec les tâches groupées par projet
      res.json(tasksByProject);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur lors de la récupération des tâches avec projets' });
    }
  });
  


module.exports = { createTask, getalTask, getTasksByProject,getaTask, deleteTask, updateaTask,updateTaskRemarque,updateTaskEtat,updateTaskEmployee };