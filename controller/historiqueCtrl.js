const historiqueModel = require("../models/historiqueModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createHistorique = asyncHandler(async (req, res, next) => {
    try {
        const titre = req.body.titre;
        const findHistorique = await historiqueModel.findOne({ titre });
        if (findHistorique) {
            throw new Error("Historique existe déjà");
        }
        const newHistorique = await historiqueModel.create(req.body);
        res.json(newHistorique);
    } catch (error) {
        next(error);
    }
});

const getallHistoriques = asyncHandler(async (req, res, next) => {
    try {
        const historiques = await historiqueModel.find();
        res.json(historiques);
    } catch (error) {
        throw new Error(error);
    }
});




const deleteHistorique = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
 
    try {
      const deleteHistorique = await historiqueModel.findByIdAndDelete(id);      
      res.json({
        deleteHistorique,
      });
    } catch (error) {
      throw new Error(error);
    }
});

const uploadImages = asyncHandler(async(req, res) =>{

    try{
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
    const images = urls.map((file) =>{
      return file;
    })
    res.json(images);
   
    } catch(error) {
      throw new Error(error);
    }
   
    })

module.exports = { createHistorique , getallHistoriques  , deleteHistorique,uploadImages };
