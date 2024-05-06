const mongoose = require("mongoose"); // Erase if already required


// Declare the Schema of the Mongo model
var Page3Schema = new mongoose.Schema(
  {
    Id_template: {
      type: String,
      required: true,
    },
    clients: {
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
        images: [
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
module.exports = mongoose.model("FormPage3", Page3Schema);