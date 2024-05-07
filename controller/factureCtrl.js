const factureModel = require("../models/factureModel");
const asyncHandler = require("express-async-handler");
const nodemailer = require('nodemailer');
const userModel = require("../models/userModel");
const sendEmail = require("./emailCtrl");
const validateMongoDbId = require("../utils/validateMongodbId");
// Création d'une facture et envoi d'un e-mail au client
const createFacture = asyncHandler(async (req, res, next) => {
    try {
        // Création de la nouvelle facture dans la base de données
        const newFacture = await factureModel.create(req.body);
        
        // Récupération des informations du client associé à cette facture
        const client = await userModel.findOne({ Nom_Prénom: newFacture.client });
        
        if (!client) {
            return res.status(404).json({ message: "Client non trouvé." });
        }
// Construction du message e-mail
const mailOptions = {
    from: 'votre@email.com', // Adresse e-mail de l'expéditeur
    to: client.email, // Adresse e-mail du client
    subject: 'Nouvelle Facture Créée', // Sujet de l'e-mail
    text: `Bonjour ${client.Nom_Prénom},\n\nUne nouvelle facture a été créée pour vous :\n\nProjet: ${newFacture.project}\nMontant: ${newFacture.montant} Dinar\n\nMerci de votre confiance.`, // Contenu texte de l'e-mail
    html: `
        <p>Bonjour ${client.Nom_Prénom},</p>
        <p>Une nouvelle facture a été créée pour vous :</p>
        <p>Projet: ${newFacture.project}</p>
        <p>Montant: ${newFacture.montant} Dinar</p>
        <p>Merci de votre confiance.</p>
    `
};


        // Envoi de l'e-mail avec Nodemailer
        await sendEmail(mailOptions);

        // Réponse JSON avec la nouvelle facture
        res.json(newFacture);
    } catch (error) {
        next(error);
    }
});
const getAllFacture = asyncHandler(async (req, res) => {
    try {
      const facture = await factureModel.find();
      res.json(facture);
    } catch (error) {
      throw new Error(error);
    }
});

const deleteFacture = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
  
    try {
      const deleteFacture = await factureModel.findByIdAndDelete(id); // Utilisez reclamationModel au lieu de Reclamation
      res.json({
        deleteFacture,
      });
    } catch (error) {
      throw new Error(error);
    }
});
const updateFacturePaymentStatus = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    try {
        // Rechercher la facture par son ID
        const facture = await factureModel.findById(id);

        if (!facture) {
            return res.status(404).json({ message: "Facture non trouvée" });
        }

        // Déterminer l'état actuel de paiement de la facture
        const currentPaymentStatus = facture.Payement;

        // Mettre à jour en fonction de l'état actuel
        let updatedFacture;
        if (currentPaymentStatus === 'Non payée') {
            // Mettre à jour à "payée"
            updatedFacture = await factureModel.findByIdAndUpdate(
                id,
                { Payement: 'payée' },
                { new: true } // Pour renvoyer le document mis à jour
            );
        
        } else {
            // Si l'état actuel n'est ni 'Non payée' ni 'payée', renvoyer une erreur
            return res.status(400).json({ message: "État de paiement invalide" });
        }

        // Répondre avec le résultat de la mise à jour
        res.json({ message: "Le statut de paiement de la facture a été mis à jour avec succès", updatedFacture });
    } catch (error) {
        // Gérer les erreurs
        next(error);
    }
});

  


module.exports = { createFacture ,getAllFacture,deleteFacture,updateFacturePaymentStatus};
