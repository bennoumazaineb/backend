const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { Schema } = mongoose;

const userSchema = new Schema({
  Nom_Prénom: {
    type: String,
    required: true,
    unique: true,
  },
  Société: {
    type: String
  },
  Partenaire: {
    type: String,

    default: "aucun",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  Téléphone: {
    unique: true,
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{8}$/.test(v); // Vérifie si le numéro de téléphone contient exactement 8 chiffres
      },
      message: (props) => `${props.value} n'est pas un numéro de téléphone valide, veuillez saisir exactement 8 chiffres.`,
    },
  },
  status: {
    type: String,
  },
  Poste: {
    type: String,
   
  },
  password: {
    type: String,
    required: true,
  },
  tasks: {
    type: String,
    default: '0',
  },
  role: {
    type: String,
    default: 'user',
  },
  etape: {
    type: String,
    default: 'etape1',
  },
  refreshToken: {
    type: String,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
},
{
  timestamps: true,
});

// Utiliser un middleware pour définir la date d'inscription lors de la création de l'utilisateur
userSchema.pre('save', function (next) {
  if (!this.registrationDate) {
    this.registrationDate = new Date();
  }
  next();
});

userSchema.plugin(require('mongoose-paginate-v2'));

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.createPasswordResetToken = async function () {
  const resettoken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resettoken).digest('hex');
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
  return resettoken;
};

module.exports = mongoose.model('User', userSchema);
