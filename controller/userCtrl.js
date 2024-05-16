const { generateRefreshToken } = require("../config/refreshtoken");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendEmail = require("./emailCtrl");
const { generateToken } = require("../config/jwtToken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const { response } = require("express");
const userModel = require("../models/userModel");

const createUser = asyncHandler(async (req, res) => {
  const { email, password, Nom_Prénom, Société, Téléphone, role,Poste,Partenaire } = req.body;

  if (!email || !password || !Nom_Prénom || !Société || !Téléphone ) {
    throw new Error("Email, password, Nom_Prénom, Société, Téléphone are required");
  }

  // Vérifier si un utilisateur existe déjà avec cet email
  const existingEmailUser = await User.findOne({ email });
  if (existingEmailUser) {
    throw new Error("Email is already in use");
  }

  // Vérifier si un utilisateur existe déjà avec ce Nom_Prénom
  const existingNameUser = await User.findOne({ Nom_Prénom });
  if (existingNameUser) {
    throw new Error("Nom_Prénom is already in use");
  }

  // Vérifier si un utilisateur existe déjà avec ce Téléphone
  const existingPhoneUser = await User.findOne({ Téléphone });
  if (existingPhoneUser) {
    throw new Error("Téléphone is already in use");
  }

  // Créer un nouvel utilisateur s'il n'existe pas déjà
  const newUser = await User.create({
    email,
    password,
    Nom_Prénom,
    Société,
    Téléphone,
Poste,
Partenaire,
    role
  });

  // Envoyer un e-mail de bienvenue (fonction à implémenter)
  await sendWelcomeEmail(email, password);

  res.json(newUser);
});


const sendWelcomeEmail = async (email, password) => {
  const loginURL = `https://gedproject.site/auth/login`;

  // Construction de l'URL de connexion
  const data = {
    to: email,
    subject: "Bienvenue !",
    text: `Bonjour, bienvenue ! Votre email est : ${email} et votre mot de passe est : ${password}. 
Veuillez cliquer sur ce lien pour vous connecter : ${loginURL}`,
    // Utilisation de resetURL (ou loginURL) dans la partie HTML de l'e-mail
    html: `<p>Bonjour, bienvenue ! Votre mot de passe est : ${password}. Veuillez cliquer sur le lien ci-dessous pour vous connecter :</p><br><a href="${loginURL}">Connexion</a>`,
  };

  // Envoi de l'e-mail avec les données fournies
  await sendEmail(data);
};






// Login a user
const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Recherche de l'utilisateur dans la base de données par nom d'utilisateur
  const findUser = await User.findOne({ email });

  // Vérification si l'utilisateur existe et si le mot de passe correspond
  if (findUser && (await findUser.isPasswordMatched(password))) {
    // Génération d'un token de rafraîchissement
    const refreshToken = await generateRefreshToken(findUser._id);

    // Mise à jour du token de rafraîchissement pour l'utilisateur dans la base de données
    const updatedUser = await User.findByIdAndUpdate(
      findUser._id,
      { refreshToken },
      { new: true }
    );

    // Définition du cookie de rafraîchissement dans la réponse HTTP
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000, // Durée de validité du cookie en millisecondes
    });

    // Envoi de la réponse JSON contenant les données de l'utilisateur et le token d'authentification
    res.json({
      _id: updatedUser._id,
      Nom_Prénom: updatedUser.Nom_Prénom,
      email: updatedUser.email,
      Téléphone: updatedUser.Téléphone,
      Société: updatedUser.Société,
      Poste: updatedUser.Poste,
      role: updatedUser.role,
      token: generateToken(updatedUser._id), // Génération du token d'authentification JWT
    });
  } else {
    // En cas de nom d'utilisateur ou de mot de passe incorrects, renvoyer une erreur
    throw new Error("Invalid Credentials");
  }
});


const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error(" No Refresh token present in db or not matched");
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err || user.id !== decoded.id) {
        throw new Error("There is something wrong with refresh token");
      }
      const accessToken = generateToken(user?._id);
      res.json({ accessToken });
    });
  });

const logout = async (req, res) => {
  try {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      });
      return res.sendStatus(204); // Pas de token de rafraîchissement dans les cookies, retourne une réponse "No Content"
    }

    const refreshToken = cookie.refreshToken;

    // Trouver l'utilisateur par le token de rafraîchissement
    const user = await User.findOne({ refreshToken });

    if (!user) {
      // Si aucun utilisateur n'est trouvé avec le token de rafraîchissement, nettoyer le cookie et renvoyer une réponse "No Content"
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      });
      return res.sendStatus(204);
    }

    // Mettre à jour le champ refreshToken de l'utilisateur à une chaîne vide
    await User.findOneAndUpdate({ refreshToken }, { refreshToken: "" });

    // Nettoyer le cookie de rafraîchissement et renvoyer une réponse "No Content"
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    res.sendStatus(204);
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).send('Internal Server Error');
  }
};


const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      throw new Error("Token Expired or Invalid");
    }

    // Mise à jour du mot de passe de l'utilisateur
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // Sauvegarde des modifications dans la base de données
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});





const getAllEmployeesWithLessThanTenTasks = async (req, res) => {
  try {
    // Récupérer tous les utilisateurs avec le rôle "employee"
    const employees = await User.find({ role: "employee" });

    // Filtrer les employés ayant moins de 10 tâches
    const filteredEmployees = employees.filter(employee => employee.tasks < 10);

    // Envoyer les employés filtrés en tant que réponse JSON
    res.json(filteredEmployees);
  } catch (error) {
    // Gestion des erreurs
    console.error(error);
    res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des employés." });
  }
};




const getallUser = asyncHandler(async (req, res, next) => {
  try {
    const getUsers = await User.find(); // Recherche tous les utilisateurs
    res.status(200).json(getUsers);
  } catch (error) {
    next(error);
  }
});
const getallUsersaufemployees = asyncHandler(async (req, res, next) => {
  try {
    const getUsers = await User.find({ $or: [{ role: "client" }, { role: "partner" }, { role: "admin" }] });
    res.status(200).json(getUsers);
  } catch (error) {
    next(error);
  }
});



const getallUserclient = asyncHandler(async (req, res, next) => {
  try {
    const getUsers = await User.find({ role: "client" }); // Recherche tous les clients
    res.json(getUsers);
  } catch (error) {
    next(error);
  }
});
const getAdmin = asyncHandler(async (req, res, next) => {
  try {
    const getAdmin = await User.find({ role: "admin" }); // Recherche tous les partenaires
    res.json(getAdmin);
  } catch (error) {
    throw new Error(error);
  }
});
const getallUserPartners = asyncHandler(async (req, res, next) => {
  try {
    const getUsers = await User.find({ role: "partner" }); // Recherche tous les partenaires
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

const getallUserEmployees = asyncHandler(async (req, res, next) => {
  try {
    const getUsers = await User.find({ role: "employee" }); // Recherche tous les employés
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

const getClientCountByMonth = asyncHandler(async (req, res) => {
  try {
    const clientCountsByMonth = await User.aggregate([
      {
        $match: { role: 'client' }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          month: {
            $switch: {
              branches: [
                { case: { $eq: ['$_id', 1] }, then: 'Jan' },
                { case: { $eq: ['$_id', 2] }, then: 'Feb' },
                { case: { $eq: ['$_id', 3] }, then: 'Mar' },
                { case: { $eq: ['$_id', 4] }, then: 'Apr' },
                { case: { $eq: ['$_id', 5] }, then: 'May' },
                { case: { $eq: ['$_id', 6] }, then: 'Jun' },
                { case: { $eq: ['$_id', 7] }, then: 'Jul' },
                { case: { $eq: ['$_id', 8] }, then: 'Aug' },
                { case: { $eq: ['$_id', 9] }, then: 'Sep' },
                { case: { $eq: ['$_id', 10] }, then: 'Oct' },
                { case: { $eq: ['$_id', 11] }, then: 'Nov' },
                { case: { $eq: ['$_id', 12] }, then: 'Dec' }
              ],
              default: 'Unknown'
            }
          },
          count: 1
        }
      },
      {
        $sort: { '_id': 1 } // Tri par l'identifiant de mois pour obtenir l'ordre correct
      }
    ]);
    
    // Maintenant, triez les résultats par le numéro de mois (_id) pour obtenir l'ordre correct
    res.json(clientCountsByMonth);
    
  } catch (error) {
    console.error('Error fetching client counts by month:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


const getaUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const getaUser = await User.findById(id);
      res.json({
        getaUser,
      });
    } catch (error) {
      throw new Error(error);
    }
  });


  const updateUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    try {
        const updateUser = await userModel.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true } // Added runValidators to run schema validators
        );
        if (!updateUser) {
            return res.status(404).json({ message: 'User non trouvée' });
        }
        res.json(updateUser);
    } catch (error) {
        next(error);
    }
});

const getallUsersExceptAdminAndEmployees = asyncHandler(async (req, res, next) => {
  try {
    // Rechercher tous les utilisateurs sauf les administrateurs et les employés
    const getUsers = await User.find({
      role: { $nin: ["admin", "employee"] } // Récupérer les utilisateurs dont le rôle n'est pas 'admin' ni 'employee'
    });

    res.status(200).json(getUsers);
  } catch (error) {
    next(error);
  }
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found with this email");
    try {
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='https://gedproject.site/auth/reset-password/${token}/${email}''>Click Here</>`;
        const data = {
            to: email,
            text: "Hey User",
            subject: "Forgot Password Link",
            htm: resetURL,
        };
        sendEmail(data);
        res.json(token);
    } catch (error) {
        throw new Error(error);
    }
});

const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
  
    try {
      const blockusr = await User.findByIdAndUpdate(
        id,
        {
          isBlocked: true,
        },
        {
          new: true,
        }
      );
      res.json(blockusr);
    } catch (error) {
      throw new Error(error);
    }
  });
  
  const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
  
    try {
      const unblock = await User.findByIdAndUpdate(
        id,
        {
          isBlocked: false,
        },
        {
          new: true,
        }
      );
      res.json({
        message: "User UnBlocked",
      });
    } catch (error) {
      throw new Error(error);
    }
  });
  

  const editEmployee = async (req, res) => {
    try {
        // Récupérer l'ID de l'utilisateur à éditer depuis les paramètres de la requête
        const { id } = req.params;
      
        // Rechercher l'utilisateur dans la base de données par son ID
        const user = await User.findById(id);

        // Vérifier si l'utilisateur existe
        if (!user) {
            // Si l'utilisateur n'existe pas, renvoyer une réponse avec le statut 404
            return res.status(404).json({ message: "User not found." });
        }

        // Vérifier si l'utilisateur a le rôle "employee"
        if (user.role !== "employee") {
            // Si l'utilisateur n'a pas le rôle "employee", renvoyer une réponse avec le statut 403
            return res.status(403).json({ message: "The user is not an employee." });
        }

        // Incrémenter le nombre de tâches de l'employé
        user.tasks += 1;

        // Enregistrer les modifications dans la base de données
        await user.save();

        // Répondre avec les détails de l'utilisateur mis à jour
        res.json(user);
    } catch (error) {
        // En cas d'erreur, renvoyer une réponse avec le statut 500 et un message d'erreur
        console.error(error);
        res.status(500).json({ message: "An error occurred while updating user tasks." });
    }
};
const deleteaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const deleteaUser = await User.findByIdAndDelete(id);
    res.json({
      deleteaUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
    createUser,
    loginUserCtrl,
    getallUser,
    getaUser,
    handleRefreshToken,
    forgotPasswordToken,
    logout,
    blockUser,getAdmin,
    unblockUser,
    getallUserPartners,getallUsersExceptAdminAndEmployees,
    getallUserclient,getClientCountByMonth,
    getallUserEmployees,resetPassword,getAllEmployeesWithLessThanTenTasks,editEmployee,updateUser,deleteaUser,getallUsersaufemployees
};
