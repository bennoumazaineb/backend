const Page2 = require("../models/formpage2Model");
const asyncHandler = require("express-async-handler");
const fs = require("fs");
const validateMongoDbId = require("../utils/validateMongodbId");
const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require("../utils/cloudinary");

const createPage2 = asyncHandler(async (req, res) => {
  try {
    const newPage2 = await Page2.create(req.body);
    res.json(newPage2);
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
      console.log(newpath);
      urls.push(newpath);
      fs.unlinkSync(path);
    }
    const images = urls.map((file) => {
      return file;
    });
    res.json(images);
  } catch (error) {
    console.error("Erreur lors de l'upload des images :", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
const getallPage2 = asyncHandler(async (req, res) => {
  const getallPage2 = await Page2.find();
  res.json(getallPage2);
});
const getFormpage2 = asyncHandler(async (req, res, next) => {
  const { Id_template, clients } = req.params;

  try {


    const page1 = await Page2.findOne({ Id_template, clients });

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
const deleteForm2 = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const deleteForm2 = await Page2.findByIdAndDelete(id);
    if (!deleteForm2) {
      return res.status(404).json({ message: 'Formulaire not found' });
    }
    res.json({ message: 'Formulaire deleted successfully' });
  } catch (error) {
    next(error);
  }
});
module.exports = { createPage2, uploadImages, getFormpage2,getallPage2,deleteForm2 };
