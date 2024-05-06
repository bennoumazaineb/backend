const express = require("express");
const { createHistorique , getallHistoriques  , deleteHistorique,uploadImages}= require('../controller/historiqueCtrl')
const {uploadPhoto,templatesImgResize} = require("../middlewares/uploadImages")
const router =express.Router();
router.post("/addhistorique",createHistorique);
router.get("/all-historiques", getallHistoriques);
router.delete("/:id",deleteHistorique);
router.put("/upload",uploadPhoto.array("images", 10),uploadImages);

module.exports = router;

