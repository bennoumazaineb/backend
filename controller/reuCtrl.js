const reunionModel = require("../models/reunionModel");
const asyncHandler = require("express-async-handler");
const nodemailer = require('nodemailer');
const userModel = require("../models/userModel");
const sendEmail = require("./emailCtrl");
const createReunion = asyncHandler(async (req, res, next) => {
    try {
        const newReu = await reunionModel.create(req.body);
        res.json(newReu);
    } catch (error) {
        next(error);
    }
});


const deleteReu = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletereu = await reunionModel.findByIdAndDelete(id);
        res.json({ deletereu });
    } catch (error) {
        next(error);
    }

});


  
  

  
  
 
  


const updateReu = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    try {
        const updateReu = await reunionModel.findByIdAndUpdate(
            id,
            {
                titre: req.body.titre,
                description: req.body.description,
                affecte_par: req.body.affecte_par,
                type: req.body.type,
               
            },
            { new: true }
        );
        res.json(updateReu);
    } catch (error) {
        next(error);
    }
});
const updatePropositionRefusedToAccepted = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    try {
        // Rechercher la proposition par son ID
        const proposition = await reunionModel.findById(id);

        if (!proposition) {
            return res.status(404).json({ message: "Proposition non trouvée" });
        }

        // Déterminer l'état actuel de la proposition
        const currentProposition = proposition.Proposition;

        // Mettre à jour en fonction de l'état actuel
        let updatedProposition;
        if (currentProposition === 'refusée') {
            // Mettre à jour à "accepté"
            updatedProposition = await reunionModel.findByIdAndUpdate(
                id,
                { Proposition: 'acceptée' },
                { new: true } // Pour renvoyer le document mis à jour
            );
        } else if (currentProposition === 'acceptée') {
            // Mettre à jour à "refusé"
            updatedProposition = await reunionModel.findByIdAndUpdate(
                id,
                { Proposition: 'refusée' },
                { new: true } // Pour renvoyer le document mis à jour
            );
        } else {
            // Si l'état actuel n'est ni 'refusé' ni 'accepté', renvoyer une erreur
            return res.status(400).json({ message: "État de proposition invalide" });
        }

        // Répondre avec le résultat de la mise à jour
        res.json({ message: "Le statut de la proposition a été mis à jour avec succès", updatedProposition });
    } catch (error) {
        // Gérer les erreurs
        next(error);
    }
});




const getAllReus = asyncHandler(async (req, res) => {
    try {
      const reus = await reunionModel.find();
      res.json(reus);
    } catch (error) {
      throw new Error(error);
    }
});

const getaReu = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    try {
        const getaReu = await reunionModel.findById(id); // Changed to reclamationModel.findById()
        if (!getaReu) {
            return res.status(404).json({ message: 'Réclamation non trouvée' });
        }
        res.json(getaReu);
    } catch (error) {
        next(error);
    }
});






module.exports = { createReunion ,deleteReu , updateReu , getAllReus,getaReu,updatePropositionRefusedToAccepted};
