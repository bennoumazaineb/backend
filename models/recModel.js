const mongoose = require('mongoose'); 
const { Schema } = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2')

const reclamationSchema = new Schema({
 
    titre: {
        type: String,
        required: true,
    },
    Nom_Prénom: {
        type: String,
        required: true,
    },

    sujet: {
        type: String,
        required: true,
    },
    priorite: {
        type: String,
        required: true,
    },
},
    {
        timestamps: true,
      });

reclamationSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Reclamation', reclamationSchema);