const reunion1Model = require("../models/reu1Model");
const asyncHandler = require("express-async-handler");
const nodemailer = require('nodemailer');
const userModel = require("../models/userModel");
const sendEmail = require("./emailCtrl");

const sendNotificationEmail = async (userEmails, parsedDate, Lien) => {
    let additionalInfo = '';
    let linkContent = '';

    if (Lien) {
        additionalInfo = `Votre réunion est en ligne, voici le lien : ${Lien}.`;
        linkContent = `<a href="${Lien}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none;">Rejoindre la réunion</a>`;
    } else {
        additionalInfo = 'Votre réunion est prévue en présentiel dans la société à la date et heure précisées.';
    }

    const mailOptions = {
        from: 'votre_email@gmail.com',
        to: userEmails.join(','),
        subject: 'Nouvelle réunion créée',
        text: `Une nouvelle réunion a été créée pour vous. Date et heure : ${parsedDate}. ${additionalInfo}`,
        html: `<p>Une nouvelle réunion a été créée pour vous le ${parsedDate}. ${additionalInfo} ${linkContent} </p>
               <p>Veuillez vous connecter pour plus de détails : <a href="${Lien || '#'}">Connexion</a></p>`,
    };

    await sendEmail(mailOptions);
};

const createReunionAndSendEmail = async (req, res, next) => {
    try {
        const { dateetHeure_Reunion, User, Lien } = req.body;

        if (!dateetHeure_Reunion || typeof dateetHeure_Reunion !== 'string') {
            throw new Error('Format de date et heure manquant ou invalide.');
        }

        const parsedDate = new Date(dateetHeure_Reunion);

        if (isNaN(parsedDate.getTime())) {
            throw new Error('Format de date invalide. Utilisez le format YYYY-MM-DDTHH:mm.');
        }

        // Vérifier si User est défini et contient des adresses e-mail
        if (!User || !Array.isArray(User) || User.length === 0) {
            throw new Error('Aucune adresse e-mail de destinataire spécifiée.');
        }

        // Récupérer les adresses e-mail des utilisateurs à partir de leurs noms
        const userEmails = [];
        for (const Nom_Prénom of User) {
            const user = await userModel.findOne({ Nom_Prénom });
            if (user && user.email) {
                userEmails.push(user.email);
            } else {
                throw new Error(`Adresse e-mail non trouvée pour l'utilisateur ${Nom_Prénom}`);
            }
        }

        // Création de la réunion dans la base de données
        const userIds = userEmails.map(userEmail => userEmail._id);
        const newReu = await reunion1Model.create({
            User: userIds,
            Lien,
            dateetHeure_Reunion: parsedDate
        });

        // Envoi de l'e-mail de notification aux utilisateurs concernés
        await sendNotificationEmail(userEmails, parsedDate, Lien);

        res.json(newReu);
    } catch (error) {
        console.error('Erreur lors de la création de la réunion:', error);
        next(error); // Propagation explicite de l'erreur à la prochaine fonction middleware
    }
};

module.exports = { createReunionAndSendEmail};