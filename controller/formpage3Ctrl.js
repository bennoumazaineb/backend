const Page3 = require("../models/formpage3Model");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const fs = require("fs");

const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require("../utils/cloudinary");

const createPage3 = asyncHandler(async (req, res) => {
  try {
    console.log("Données reçues pour la création de la page :", req.body);
    const newPage3 = await Page3.create(req.body);
    console.log("Page créée avec succès :", newPage3);
    res.json(newPage3);
  } catch (error) {
    console.error("Erreur lors de la création de la page :", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const uploadImages = asyncHandler(async (req, res) => {
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      console.log("Chemin de l'image téléversée :", newpath);
      urls.push(newpath);
      fs.unlinkSync(path);
    }
    const images = urls.map((file) => {
      return file;
    });
    console.log("Images téléversées avec succès :", images);
    res.json(images);
  } catch (error) {
    console.error("Erreur lors du téléversement des images :", error);
    throw new Error(error);
  }
});

const getallPage3 = asyncHandler(async (req, res) => {
  const getallPage3 = await Page3.find();
  console.log("Toutes les pages récupérées avec succès :", getallPage3);
  res.json(getallPage3);
});

const getFormpage3 = asyncHandler(async (req, res, next) => {
  const { Id_template, clients } = req.params;

  try {


    const page1 = await Page3.findOne({ Id_template, clients });

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
const deleteForm3 = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const deleteForm3 = await Page3.findByIdAndDelete(id);
    if (!deleteForm3) {
      return res.status(404).json({ message: 'Formulaire not found' });
    }
    res.json({ message: 'Formulaire deleted successfully' });
  } catch (error) {
    next(error);
  }
});
module.exports = { createPage3, uploadImages, getFormpage3, getallPage3,deleteForm3 };
