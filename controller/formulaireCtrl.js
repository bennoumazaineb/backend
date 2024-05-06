const Formulaire = require("../models/formulaireModel");
const asyncHandler = require("express-async-handler");
const fs = require("fs");
const { cloudinaryUploadImg, cloudinaryDeleteImg } = require("../utils/cloudinary");
const validateMongoDbId = require("../utils/validateMongodbId");
const createForm = asyncHandler(async (req, res) => {
  console.log("Données du formulaire reçues :", req.body);
  const newForm = await Formulaire.create(req.body);
  res.json(newForm);
});


const uploadImages = asyncHandler(async (req, res) => {
  const uploader = (path) => cloudinaryUploadImg(path, "images");
  const urls = [];
  const files = req.files;
  for (const file of files) {
    const { path } = file;
    const newpath = await uploader(path);
    urls.push(newpath);
    fs.unlinkSync(path);
  }
  const images = urls.map((file) => {
    return file;
  });
  res.json(images);
});

const getallForm = asyncHandler(async (req, res) => {
  const getForm = await Formulaire.find();
  res.json(getForm);
});
const deleteForm = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const deleteForm = await Formulaire.findByIdAndDelete(id);
    if (!deleteForm) {
      return res.status(404).json({ message: 'Formulaire not found' });
    }
    res.json({ message: 'Formulaire deleted successfully' });
  } catch (error) {
    next(error);
  }
});
const getaForm = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  console.log('ID du formulaire demandé :', id); // Ajout d'un message de journalisation

  validateMongoDbId(id);

  try {
    const form = await Formulaire.findById(id);
    if (!form) {
      console.log('Formulaire non trouvé.'); // Ajout d'un message de journalisation
      return res.status(404).json({ message: 'Template not found' });
    }
    res.json({form});
  } catch (error) {
    console.error('Erreur lors de la récupération du formulaire :', error); // Ajout d'un message de journalisation
    next(error);
  }
});


module.exports = {
  createForm,
  getallForm,
  uploadImages,
  deleteForm,getaForm
};
