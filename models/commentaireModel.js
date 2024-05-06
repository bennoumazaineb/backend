const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentaireSchema = new Schema({
    project:{
        type: String,
        required: true,
    },
  
   
    affecte_par : {
        type: String,
        required: true,
     
       
    },
    Commentaire: {
        type: String,
        required: true,
    },
   
});
module.exports = mongoose.model('commentaire', commentaireSchema);
