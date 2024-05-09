const fs = require("fs");
const asyncHandler = require("express-async-handler");

const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require("../utils/cloudinary");
const uploadImages = asyncHandler(async (req, res) => {
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      urls.push(newpath);

    }
    const images = urls.map((file) => {
      return file;
    });
    
    res.json(images);
    console.log("sss")
  } catch (error) {
    throw new Error(error);
    console.log("sssdd")
  } 
});
const deleteImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = cloudinaryDeleteImg(id, "images");
    res.json({ message: "Deleted" });
  } catch (error) {
    throw new Error(error);
  }
});
const uploadImages1 = asyncHandler(async (req, res) => {
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      urls.push(newpath);

    }
    const images = urls.map((file) => {
      return file;
    });
    
    res.json(images);
    console.log("sss")
  } catch (error) {
    throw new Error(error);
    console.log("sssdd")
  } 
});
const deleteImages1 = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = cloudinaryDeleteImg(id, "images");
    res.json({ message: "Deleted" });
  } catch (error) {
    throw new Error(error);
  }
});
const uploadImages2 = asyncHandler(async (req, res) => {
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      urls.push(newpath);

    }
    const images = urls.map((file) => {
      return file;
    });
    
    res.json(images);
    console.log("sss")
  } catch (error) {
    throw new Error(error);
    console.log("sssdd")
  } 
});
const deleteImages2 = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = cloudinaryDeleteImg(id, "images");
    res.json({ message: "Deleted" });
  } catch (error) {
    throw new Error(error);
  }
});
const uploadImages3 = asyncHandler(async (req, res) => {
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      urls.push(newpath);

    }
    const images = urls.map((file) => {
      return file;
    });
    
    res.json(images);
    console.log("sss")
  } catch (error) {
    throw new Error(error);
    console.log("sssdd")
  } 
});
const deleteImages3 = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = cloudinaryDeleteImg(id, "images");
    res.json({ message: "Deleted" });
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  uploadImages,
  deleteImages,
  uploadImages1,
  deleteImages1,
  uploadImages2,
  deleteImages2,
  uploadImages3,
  deleteImages3,
};