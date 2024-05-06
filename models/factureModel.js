const mongoose = require('mongoose');
const { Schema } = mongoose;

const factureSchema = new Schema({
    client:{
        type: String,
        required: true,
    },
  
   
    project : {
        type: String,
        required: true,
     
       
    },
    montant: {
        type: Number,
        required: true,
    },
    Payement:   {
        type: String,
        enum: ['payée', 'Non payée'], // Définir les valeurs autorisées pour le champ type
        default: 'Non payée' // Valeur par défaut
    },
   
});
module.exports = mongoose.model('facture', factureSchema);
