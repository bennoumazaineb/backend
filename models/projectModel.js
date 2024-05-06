const mongoose = require('mongoose');
const { Schema } = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2')
const projectSchema = new Schema({
    nom: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
       
       
    },
    type: {
        type: String,
        required: true,
    },
    client: {
        type: String,
        required: true,
    },

    duree: {
        type: Number,
        required: true,
    },
    priorité: {
        type: String,
        required: true,
    },
    date_debutprojet: {
        type: Date,
        required: true,
        default: Date.now // Vous pouvez définir une valeur par défaut si nécessaire
      },
      date_finprojet: {
        type: Date,
        required: true,
        default: Date.now // Vous pouvez définir une valeur par défaut si nécessaire
      },
   
});
projectSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Project', projectSchema);