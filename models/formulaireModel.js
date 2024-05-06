const mongoose = require("mongoose"); 


// Declare the Schema of the Mongo model
var FormSchema = new mongoose.Schema(
    {
    Id_template: {
     type: String,
     required: true,
          },
          
    Nom_Prénom : {
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
      a_propos: {
        type: String,
        required: true,
      },
      valeur: {
        type: String,
        required: true,
     
      },
      equipe: {
        type: String,
        required: true,
      },
      information: {
          type: String,
          required: true,
      },
      
      services :[
        {titre :{
        type: String,
          required:true
        },
        description_court : {
            type: String,
            required:true
        },
        description: {
            type: String,
            required:true
        },
        images3: [
            {
              public_id: String,
              url: String,
            },
          ],
  
        }
      ],
    },
    {
        timestamps: true,
      }
    );



//Export the model
module.exports = mongoose.model("Form", FormSchema);