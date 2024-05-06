const express = require("express");
const { Add, Verify }= require('../controller/payementCtrl')

const router =express.Router();
router.post("/",Add);
router.post("/:id",Verify)


module.exports = router;

