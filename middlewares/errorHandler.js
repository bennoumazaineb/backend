// Middleware pour gérer les routes non trouvées (404 Not Found)
const notFound = (req, res, next) => {
    const error = new Error(`Not Found : ${req.originalUrl}`);
    res.status(404);
    next(error); // Passer l'erreur au middleware d'erreur suivant
};

// Middleware pour gérer les erreurs
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? 'Erreur de serveur' : err.stack, // Masquer la pile d'appels en production
    });
};

module.exports = { notFound, errorHandler };
