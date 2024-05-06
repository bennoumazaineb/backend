const projectModel = require("../models/projectModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const Task = require("../models/taskModel");
const createProject = asyncHandler(async (req, res, next) => {
    try {
        const nom = req.body.nom;

        // Vérifier si le nom du projet existe déjà
        const existingProject = await projectModel.findOne({ nom });
        if (existingProject) {
            // Si le projet existe déjà avec ce nom, renvoyer une erreur
            throw new Error("Un projet avec ce nom existe déjà");
        }

        // Créer un nouveau projet avec le nom unique
        const newProject = await projectModel.create(req.body);

        // Renvoyer la réponse avec le nouveau projet créé
        res.json(newProject);
    } catch (error) {
        // Passer l'erreur au middleware d'erreur suivant
        next(error);
    }
});

const createProjectTask= asyncHandler(async (req, res, next) => {
    try {
        const type = req.body.type;
        const newProject = await projectModel.create(req.body);
        await createDefaultTasks(newProject.nom);
        res.json(newProject);
    } catch (error) {
        next(error);
    }
});


const createDefaultTasks = async (projectId) => {
    const defaultTasks = [
        { Titre: "Planification", project: projectId, Description: "Rendez-vous, Définition des objectifs de votre Site internet, et Prise d’informations.", Priorité: "Haute",Etat:"0", Durée: 5, Phase_projet: "Phase 1" },
        { Titre: "conception", project: projectId, Description: "Présentation des maquettes et des idées.", Priorité: "Haute", Durée: 5, Phase_projet: "Phase 2",Etat:"0" },
        { Titre: "Développement", project: projectId, Description: "Développement & Lancement de votre site internet.", Priorité: "Haute", Durée: 5, Phase_projet: "Phase 3",Etat:"0", }
    ];

    try {
        await Task.create(defaultTasks);
    } catch (error) {
        throw new Error("Erreur lors de la création des tâches par défaut");
    }
};


const getallProject = asyncHandler(async (req, res, next) => {
    try {
        const getProject = await projectModel.find({});
        res.json(getProject);
    } catch (error) {
        throw new Error(error);
    }
});



const getaProject = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id); // Valider l'ID de MongoDB
    try {
        const getaProject = await projectModel.findById(id);
        res.json({
            getaProject,
        });
    } catch (error) {
        throw new Error(error);
    }
});

const updateProject = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    try {
        const updateProject = await projectModel.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true } 
         
        );
        res.json(updateProject);
    } catch (error) {
        next(error);
    }
});

const deleteProjet = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
 
    try {
      const deletedRec = await projectModel.findByIdAndDelete(id);      
      res.json({
        deletedRec,
      });
    } catch (error) {
      throw new Error(error);
    }
});
const getProjectCountByMonth = asyncHandler(async (req, res, next) => {
    try {
        const projectCountsByMonth = await projectModel.aggregate([
            {
                $group: {
                    _id: { $month: "$date_debutprojet" }, // Grouper par mois
                    count: { $sum: 1 } // Compter le nombre de projets par mois
                }
            },
            {
                $project: {
                    month: { $arrayElemAt: [["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], { $subtract: ["$_id", 1] }] },
                    count: 1,
                    _id: 0
                }
            }
        ]);

        res.json(projectCountsByMonth);
    } catch (error) {
        next(error);
    }
});

const getAllProjectsByClient = asyncHandler(async (req, res) => {
    try {
      // Récupérer toutes les tâches de la base de données avec le champ Projet
      const allproject = await projectModel.find().populate('client');
    
      if (allproject.length === 0) {
        return res.status(404).json({ message: 'Aucune tâche trouvée dans la base de données' });
      }
    
      // Créer un objet pour regrouper les tâches par projet
      const AllProjectsByClient = {};
    
      // Parcourir toutes les tâches pour regrouper par projet
      allproject.forEach(project => {
        const clientName = project.client; // Utiliser la propriété project au lieu de Projet
    
        if (!AllProjectsByClient[clientName]) {
          // Initialiser un tableau vide pour stocker les tâches de ce projet
          AllProjectsByClient[clientName] = [];
        }
    
        // Ajouter la tâche au tableau correspondant au projet
        AllProjectsByClient[clientName].push(project);
      });
    
      // Créer la réponse JSON avec les tâches groupées par projet
      res.json(AllProjectsByClient);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur lors de la récupération des tâches avec projets' });
    }
  });





module.exports = { createProject, updateProject,getAllProjectsByClient, getallProject, getaProject,deleteProjet,createProjectTask ,getProjectCountByMonth};
