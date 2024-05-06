const mongoose = require("mongoose"); // Erase if already required


// Declare the Schema of the Mongo model
var Page2Schema = new mongoose.Schema(
  {
    Id_template: {
      type: String,
      required: true,
    },
    clients: {
      type: String,
      required: true,
      },
    a_propos: {
      type: String,
      required: true,
    },
 
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
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
   
  
  },
  {
    timestamps: true,
  }
);



//Export the model
module.exports = mongoose.model("FormPage2", Page2Schema);