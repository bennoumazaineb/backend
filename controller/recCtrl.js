const asyncHandler = require("express-async-handler");
const reclamationModel = require('../models/recModel');
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const validateMongoDbId = require("../utils/validateMongodbId");
// Ajouter le plugin mongoose-paginate-v2 à mongoose
mongoose.plugin(mongoosePaginate);

const createReclamation = asyncHandler(async (req, res, next) => {
    try {
        const newRec = await reclamationModel.create(req.body);
        res.json(newRec);
    } catch (error) {
        next(error);
    }
});

const getallRec = asyncHandler(async (req, res, next) => {
    try {
        const getAllRecs = await reclamationModel.find({}); // Récupérer toutes les réclamations sans pagination
        res.json(getAllRecs);
    } catch (error) {
        next(error);
    }
});

const getaRec = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    try {
        const getaRec = await reclamationModel.findById(id); // Changed to reclamationModel.findById()
        if (!getaRec) {
            return res.status(404).json({ message: 'Réclamation non trouvée' });
        }
        res.json(getaRec);
    } catch (error) {
        next(error);
    }
});

const deleteRec = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
  
    try {
      const deletedRec = await reclamationModel.findByIdAndDelete(id); // Utilisez reclamationModel au lieu de Reclamation
      res.json({
        deletedRec,
      });
    } catch (error) {
      throw new Error(error);
    }
});


const updateRec = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    try {
        const updatedRec = await reclamationModel.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true } // Added runValidators to run schema validators
        );
        if (!updatedRec) {
            return res.status(404).json({ message: 'Réclamation non trouvée' });
        }
        res.json(updatedRec);
    } catch (error) {
        next(error);
    }
});
const getReclamationCountByMonth = asyncHandler(async (req, res, next) => {
    try {
        const reclamationCountsByMonth = await reclamationModel.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" }, // Grouper par mois
                    count: { $sum: 1 } // Compter le nombre de réclamations par mois
                }
            },
            {
                $project: {
                    month: { $arrayElemAt: [["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], { $subtract: ["$_id", 1] }] },
                    count: 1,
                    _id: 0
                }
            }
        ]);

        res.json(reclamationCountsByMonth);
    } catch (error) {
        next(error);
    }
});

module.exports = { createReclamation, deleteRec, updateRec, getallRec, getaRec,getReclamationCountByMonth };
