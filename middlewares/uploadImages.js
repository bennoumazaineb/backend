const multer = require("multer");
const Jimp = require("jimp");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images/"));
  },
  filename: function (req, file, cb) {
    const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniquesuffix + ".jpeg");
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb({ message: "Unsupported file format" }, false);
  }
};

const uploadPhoto = multer({
  storage: storage,
  fileFilter: multerFilter,
  limits: { fileSize: 1000000 },
});

const formImgResize = async (req, res, next) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file) => {
      const images = await Jimp.read(file.path);
      await images.resize(300, 300).quality(90).writeAsync(`public/images/form/${file.filename}`);
 
    })
  );
  next();
};


const templatesImgResize = async (req, res, next) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file) => {
      const images = await Jimp.read(file.path);
      await images.resize(300, 300).quality(90).writeAsync(`public/images/templates/${file.filename}`);
 
    })
  );
  next();
};
const FormPage1ImgResize = async (req, res, next) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file) => {
      const image = await Jimp.read(file.path);
      await image.resize(300, 300).quality(90).writeAsync(`public/images/page1/${file.filename}`);
     
    })
  );
  next();
};
const FormPage2ImgResize = async (req, res, next) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file) => {
      const image = await Jimp.read(file.path);
      await image.resize(300, 300).quality(90).writeAsync(`public/images/page2/${file.filename}`);
   
    })
  );
  next();
};
const FormPage3ImgResize = async (req, res, next) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file) => {
      const image = await Jimp.read(file.path);
      await image.resize(300, 300).quality(90).writeAsync(`public/images/page3/${file.filename}`);
    
    })
  );
  next();
};

module.exports = { uploadPhoto, FormPage1ImgResize,FormPage2ImgResize,FormPage3ImgResize,templatesImgResize,formImgResize };
