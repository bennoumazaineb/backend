const mongoose = require('mongoose');
const { Schema } = mongoose;

const reunion1Schema = new Schema({

    dateetHeure_Reunion: {
        type: Date,
        default: Date.now
    },
    User: [{
        type: Schema.Types.ObjectId,
        ref: 'User' // Référence vers le modèle User
    }],
    Lien: {
        type: String,
        default: '' // Chaîne vide comme valeur par défaut pour un champ String
    }
});

module.exports = mongoose.model('Reunion1', reunion1Schema);
