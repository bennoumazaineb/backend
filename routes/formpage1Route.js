const express = require("express");
const {authMiddleware, isAdmin} = require("../middlewares/authMiddleware");

const { FormPage1ImgResize, uploadPhoto } = require("../middlewares/uploadImages");
const { uploadImages, createPage1, getFormpage1,getallPage1,deleteForm1 } = require("../controller/formpage1Ctrl");
const router = express.Router();
router.post("/" , createPage1);
router.delete("/:id", deleteForm1);

router.get("/all", getallPage1);
router.get("/:Id_template/:clients", getFormpage1);

router.put(
    "/upload",
    uploadPhoto.array("images", 10),
    FormPage1ImgResize,
uploadImages
  );
module.exports =router ;