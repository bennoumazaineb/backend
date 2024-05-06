const express = require("express");
const {authMiddleware, isAdmin} = require("../middlewares/authMiddleware");

const {FormPage3ImgResize, uploadPhoto } = require("../middlewares/uploadImages");
const { createPage3, uploadImages, getFormpage3,getallPage3,deleteForm3 } = require("../controller/formpage3Ctrl");


const router = express.Router();
router.post("/" , createPage3);
router.delete("/:id", deleteForm3);
router.get("/all", getallPage3);
router.get("/:Id_template/:clients", getFormpage3);
router.put(
    "/upload",
    uploadPhoto.array("images", 10),
    FormPage3ImgResize,
uploadImages
  );
module.exports =router ;