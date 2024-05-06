const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const fs = require("fs");
const { cloudinaryUploadImg } = require("../utils/cloudinary");

const Template = require("../models/templateModel");

const createTemplate = asyncHandler(async (req, res, next) => {
  try {
    const newTemplate = await Template.create(req.body);
    res.json(newTemplate);
  } catch (error) {
    next(error); // Passer l'erreur au middleware d'erreur global
  }
});

const getallTemplate = asyncHandler(async (req, res) => {
  const getTemplates = await Template.find();
  res.json(getTemplates);
});

const updateTemplate = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const updateTemplate = await Template.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!updateTemplate) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.json(updateTemplate);
  } catch (error) {
    next(error);
  }
});

const deleteTemplate = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const deleteTemplate = await Template.findByIdAndDelete(id);
    if (!deleteTemplate) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    next(error);
  }
});

const uploadImages = asyncHandler(async (req, res, next) => {
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = []
    const files = req.files
    for (const file of files) {
      const {path} = file
      const newpath = await uploader(path)
      console.log(newpath)
      urls.push(newpath)
      fs.unlinkSync(path);
    }
    const images = urls.map((file) => {
      return file;
    })
    res.json(images);
  } catch(error) {
    next(error);
  }
});

const getaTemplate = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const getaTemplate = await Template.findById(id);
    if (!getaTemplate) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.json({ getaTemplate });
  } catch (error) {
    next(error);
  }
});

module.exports = {
  createTemplate,
  getallTemplate,
  updateTemplate,
  deleteTemplate,
  getaTemplate,
  uploadImages
};
