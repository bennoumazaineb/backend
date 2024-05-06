const express = require("express");
const router = express.Router();
const { createForm, getallForm, uploadImages,deleteForm,getaForm } = require("../controller/formulaireCtrl");
const { uploadPhoto, formImgResize } = require("../middlewares/uploadImages");

// Route pour créer un formulaire
router.post("/", createForm);
router.delete("/:id", deleteForm);

// Route pour obtenir tous les formulaires
router.get("/all", getallForm);
router.get("/:id", getaForm);
// Route pour télécharger des images
router.put(
  "/upload",
  uploadPhoto.array("images", 10),
  formImgResize,
  uploadImages
);

module.exports = router;
