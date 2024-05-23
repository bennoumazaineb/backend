const mongoose = require('mongoose');
const { Schema } = mongoose;

const reunionSchema = new Schema({
   
    titre: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    affecte_par : {
        type: String,
        required: true,
      
       
    },
    type:{
        type: String,
        required: true,


    },
    Proposition:{
        type: String,
        enum: ['refusée', 'acceptée'], // Définir les valeurs autorisées pour le champ type
        default: 'refusée' // Valeur par défaut
    },
    
   
   
});
module.exports = mongoose.model('Reunion', reunionSchema);
