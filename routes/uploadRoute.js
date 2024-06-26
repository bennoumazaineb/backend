const express = require("express");
const { uploadImages, deleteImages } = require("../controller/uploadCtrl");
const { uploadPhoto,FormPage1ImgResize,FormPage2ImgResize,FormPage3ImgResize,templatesImgResize } = require("../middlewares/uploadImages");
const router = express.Router();

router.post(
  "/",
  uploadPhoto.array("images", 10),
  FormPage1ImgResize,
  uploadImages
);
router.post(
  "/template",
  uploadPhoto.array("images", 10),
  templatesImgResize,
  uploadImages
);
router.post("/page2", uploadPhoto.array("images", 10), FormPage2ImgResize, uploadImages);

router.post(
  "/page3",
  uploadPhoto.array("images", 10),
  FormPage3ImgResize,
  uploadImages
);
router.delete("/delete-img/:id",  deleteImages);

module.exports = router;