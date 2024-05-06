const mongoose = require('mongoose');


const taskSchema = new mongoose.Schema({
    
    Titre: {
        type: String,
        required: true,
        maxlength: 100 // Limite de caractères maximale pour le titre
    },
    project:{
        type: String,
        required: true,
    },
    Description: {
        type: String,
        required: true,
        maxlength: 500 // Limite de caractères maximale pour la description
    },
    Priorité: {
        type: String,
        required: true,
        enum: ['Haute', 'Moyenne', 'Basse'] // Priorité doit être l'une de ces valeurs
    },
    Durée: {
        type: Number, // Utilisation d'un type numérique pour représenter la durée en heures
        required: true,
    
    },
    Phase_projet: {
        type: String,
        required: true
    },
    Etat: {
        type: String,
        default:'0'
       
    },
    Remarque: {
        type: String,
        default: 'Aucune' // Valeur par défaut
    },
    Version: {
        type: String,
        default: 'Aucune' // Valeur par défaut
    },

    Employe: {
        type: mongoose.Schema.Types.ObjectId,ref:"User",
        
       
    },
    date_debuttask: {
        type: Date,
        required: true,
        default: Date.now // Vous pouvez définir une valeur par défaut si nécessaire
      },
      date_fintask: {
        type: Date,
        required: true,
        default: Date.now // Vous pouvez définir une valeur par défaut si nécessaire
      },
    },
    {
        timestamps: true,
      });




module.exports = mongoose.model("Task", taskSchema);