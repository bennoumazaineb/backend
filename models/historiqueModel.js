const mongoose = require('mongoose');
const { Schema } = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2')
const historiqueSchema = new Schema({

    image: [
        {
          public_id: String,
          url: String,
        },
      ],
   
    description: {
        type: String,
        required: true,
       
       
    },
    titre: {
        type: String,
        required: true,
    },

    type: {
        type: String,
        required: true,
    },
   
   
   
});
historiqueSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Historique', historiqueSchema);
