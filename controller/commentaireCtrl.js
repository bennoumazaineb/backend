const asyncHandler = require("express-async-handler");
const commentaireModel = require('../models/commentaireModel');
const mongoose = require('mongoose');
const validateMongoDbId = require("../utils/validateMongodbId");

const createCommentaire = asyncHandler(async (req, res, next) => {
    try {
        const newCommentaire = await commentaireModel.create(req.body);
        res.json(newCommentaire);
    } catch (error) {
        next(error);
    }
});

const getallCommentaire = asyncHandler(async (req, res, next) => {
    try {
        const getAllCommentaire = await commentaireModel.find({});
        res.json(getAllCommentaire);
    } catch (error) {
        next(error);
    }
});

const deleteCommentaire = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
  
    try {
      const deleteCommentaire = await commentaireModel.findByIdAndDelete(id); // Utilisez reclamationModel au lieu de Reclamation
      res.json({
        deleteCommentaire,
      });
    } catch (error) {
      throw new Error(error);
    }
});

module.exports = { createCommentaire, deleteCommentaire, getallCommentaire };
