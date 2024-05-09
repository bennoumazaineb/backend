const express = require("express");
const { uploadImages2, deleteImages2 } = require("../controller/upload2Ctrl");
const { uploadPhoto,FormPage2ImgResize } = require("../middlewares/uploadImage2");
const router = express.Router();


router.post(
  "/page2",
  uploadPhoto.array("images", 10),
  FormPage2ImgResize,
  uploadImages2
);

router.delete("/delete-img/:id",  deleteImages2);

module.exports = router;