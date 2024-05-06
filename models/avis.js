const mongoose = require('mongoose');
const { Schema } = mongoose;

const avisSchema = new Schema({
  Avis: {
    type: String,
    required: true,
  },
  affecte_par: {
    type: String,
    required: true,
  },
  Note: {
    type: Number, // Modifier le type en Number pour stocker la valeur de la note
    required: true,
  },
},
{
  timestamps: true,
});

module.exports = mongoose.model('avis', avisSchema);
