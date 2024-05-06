const express = require("express");
const {authMiddleware, isAdmin} = require("../middlewares/authMiddleware");

const {FormPage2ImgResize, uploadPhoto } = require("../middlewares/uploadImages");
const { createPage2 , uploadImages, getFormpage2,getallPage2,deleteForm2 } = require("../controller/formpage2Ctrl");

const router = express.Router();
router.post("/", createPage2);
router.delete("/:id", deleteForm2);
router.get("/all", getallPage2);
router.get("/:Id_template/:clients", getFormpage2);
router.put(
    "/upload",
    uploadPhoto.array("images", 10),
    FormPage2ImgResize,
uploadImages
  );
module.exports =router ;