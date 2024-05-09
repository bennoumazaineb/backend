const bodyParser = require("body-parser");
const express = require("express");
const dbConnect = require("./config/dbConnect");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const dotenv = require("dotenv").config();
const authRouter = require("./routes/authRoute");
const commentaireRouter=require("./routes/commentaireRoute")
const cookieParser = require("cookie-parser");
const projectRoute = require("./routes/projectRoute");
const recRoute = require("./routes/recRoute");
const taskRoute = require("./routes/taskRoute");
const ReuRoute = require("./routes/ReuRouter");
const TemplateRoute = require("./routes/templateRoute");
const historiqueRouter =require("./routes/historiqueRoute")
const Reunion1Router=require("./routes/reu1Route")
const app = express();
const PORT = process.env.PORT || 5000;
const morgan = require("morgan");
const cors = require("cors");
const uploadRouter = require("./routes/uploadRoute");
const page1Router = require("./routes/formpage1Route");
const page2Router = require("./routes/formpage2Route");
const page3Router = require("./routes/formpage3Route");
const avisRoute=require("./routes/avisRoute")
const factureRoute=require("./routes/factureRoute")
const payementRoute =require("./routes/payement")
// Connexion à la base de données
dbConnect();

// Middleware pour parser le corps des requêtes
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/api/avis", avisRoute);
app.use("/api/reu1", Reunion1Router);

app.use("/api/facture", factureRoute);
app.use("/api/payment", payementRoute);
// Routes pour l'authentification des utilisateurs
app.use("/api/template", TemplateRoute);
app.use("/api/user", authRouter);
app.use("/api/task", taskRoute);
app.use("/api/project", projectRoute);
app.use("/api/rec", recRoute);
app.use("/api/reu", ReuRoute);
app.use("/api/page1", page1Router);
app.use("/api/page2", page2Router);
app.use("/api/page3", page3Router);
app.use("/api/upload", uploadRouter);
app.use("/api/commentaire", commentaireRouter);
app.use("/api/historique", historiqueRouter);
// Middleware pour gérer les erreurs 404 Not Found
app.use(notFound);

// Middleware pour gérer les autres erreurs
app.use(errorHandler);

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
});
