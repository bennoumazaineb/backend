const mongoose = require("mongoose"); // Erase if already required


// Declare the Schema of the Mongo model
var Page1Schema = new mongoose.Schema(
  {
    Id_template: {
      type: String,
      required: true,
    },
  
    nom_domaine: {
      type: String,
      required: true,
    },
 
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    nom_societe: {
      type: String,
      required: true,
   
    },
    adresse: {
      type: String,
      required: true,
    },
    email: {
        type: String,
        required: true,
    },
   telephone: {
    type: String,
    required: true,
    },
    clients: {
      type: String,
      required: true,
      },
  },
  {
    timestamps: true,
  }
);



//Export the model
module.exports = mongoose.model("FormPage1", Page1Schema);