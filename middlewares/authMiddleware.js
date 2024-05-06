const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const expressAsyncHandler = require("express-async-handler");

// Middleware pour l'authentification de l'utilisateur
const authMiddleware = expressAsyncHandler(async (req, res, next) => {
    let token;

    // Vérifie si un jeton est attaché à l'en-tête Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // Extrait le jeton du header
            token = req.headers.authorization.split(" ")[1];
            // Vérifie et décode le jeton
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Trouve l'utilisateur dans la base de données basé sur l'ID décodé
            const user = await User.findById(decoded.id);
            // Si l'utilisateur est trouvé, l'ajoute à l'objet de requête (req)
            if (user) {
                req.user = user;
                next(); // Passe à la prochaine fonction middleware
            } else {
                throw new Error("User not found");
            }
        } catch (error) {
            throw new Error("Not authorized, token expired or invalid");
        }
    } else {
        throw new Error("No token attached to header");
    }
});
module.exports = { authMiddleware};
