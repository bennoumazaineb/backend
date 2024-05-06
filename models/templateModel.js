const mongoose = require("mongoose");

// Déclaration du schéma du modèle MongoDB
const templateSchema = new mongoose.Schema(
  {
      Id_template: {
        type: String,
        required: true,
      },
    URL: {
      type: String,
      required: true,
    },
  
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    Description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Export du modèle
module.exports = mongoose.model("Template", templateSchema);
