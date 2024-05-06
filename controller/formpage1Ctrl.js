const Page1 = require("../models/formpage1Model");
const asyncHandler = require("express-async-handler");
const fs = require("fs");
const { cloudinaryUploadImg, cloudinaryDeleteImg } = require("../utils/cloudinary");
const validateMongoDbId = require("../utils/validateMongodbId");
const createPage1 = asyncHandler(async (req, res) => {
  try {
    console.log("Requête de création de la page1 reçue :", req.body);
    const newPage1 = await Page1.create(req.body);
    console.log("Nouvelle page1 créée avec succès :", newPage1);
    res.json(newPage1);
  } catch (error) {
    console.error("Erreur lors de la création de la page1 :", error);
    res.status(500).json({ message: "Erreur lors de la création de la page1" });
  }
});

const uploadImages = asyncHandler(async (req, res) => {
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      console.log("Chemin du fichier à télécharger :", path);
      const newpath = await uploader(path);
      urls.push(newpath);
      fs.unlinkSync(path);
      console.log("Image téléchargée et supprimée du stockage local :", path);
    }
    const images = urls.map((file) => {
      return file;
    });
    console.log("Images téléchargées :", images);
    res.json(images);
  } catch (error) {
    console.error("Erreur lors du téléchargement des images :", error);
    res.status(500).json({ message: "Erreur lors du téléchargement des images" });
  }
});

const getallPage1 = asyncHandler(async (req, res) => {
  try {
    const getallPage1 = await Page1.find().populate('clients', 'Nom_Prénom'); // Assurez-vous que 'clients' est le nom correct du champ référençant votre modèle client
    res.json(getallPage1);
  } catch (error) {
    console.error("Erreur lors de la récupération des données de la page1 :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des données de la page1" });
  }
});




const getFormpage1 = asyncHandler(async (req, res, next) => {
  const { Id_template, clients } = req.params;

  try {


    const page1 = await Page1.findOne({ Id_template, clients });

    if (!page1) {
      console.log('Formulaire non trouvé.');
      return res.status(404).json({ error: 'Formulaire non trouvé' });
    }

    res.json(page1);
  } catch (error) {
    console.error('Erreur lors de la récupération du formulaire :', error);
    next(error);
  }
});




const deleteForm1 = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const deleteForm1 = await Page1.findByIdAndDelete(id);
    if (!deleteForm1) {
      return res.status(404).json({ message: 'Formulaire not found' });
    }
    res.json({ message: 'Formulaire deleted successfully' });
  } catch (error) {
    next(error);
  }
});



module.exports = { createPage1, uploadImages, getFormpage1,getallPage1,deleteForm1 };
