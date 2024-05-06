const asyncHandler = require("express-async-handler");
const avisSchema = require('../models/avis');
const mongoose = require('mongoose');
const validateMongoDbId = require("../utils/validateMongodbId");

const createAvis = asyncHandler(async (req, res, next) => {
    try {
        const newAvis = await avisSchema.create(req.body);
        res.json(newAvis);
    } catch (error) {
        next(error);
    }
});

const getallAvis = asyncHandler(async (req, res, next) => {
    try {
        const getallAvis = await avisSchema.find({});
        res.json(getallAvis);
    } catch (error) {
        next(error);
    }
});

const deleteAvis= asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
  
    try {
      const deleteAvis = await avisSchema.findByIdAndDelete(id); // Utilisez reclamationModel au lieu de Reclamation
      res.json({
        deleteAvis,
      });
    } catch (error) {
      throw new Error(error);
    }
});

module.exports = { createAvis, deleteAvis, getallAvis };
