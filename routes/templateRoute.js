const express = require("express");
const {
  createTemplate,
  getaTemplate,
  uploadImages,deleteTemplate,updateTemplate,getallTemplate
} = require("../controller/templateCtrl");
const {uploadPhoto,templatesImgResize} = require("../middlewares/uploadImages")

const router = express.Router();

// Define routes
router.post("/", createTemplate); // Use a more generic route for creating a template

router.get("/:id", getaTemplate);
router.delete("/:id", deleteTemplate);
router.put("/:id", updateTemplate);
router.get("/", getallTemplate); // Use a more generic route for getting all templates
router.put(
  "/upload",
  uploadPhoto.array("images", 10),
  templatesImgResize,
uploadImages
);

module.exports = router;
