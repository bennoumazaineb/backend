const express = require("express");
const {createReclamation , deleteRec ,getReclamationCountByMonth, updateRec,getallRec,getaRec} = require("../controller/recCtrl");

const router = express.Router();
router.post("/addrec",createReclamation);
router.put("/:id",updateRec);
router.delete("/:id",deleteRec),
router.get("/all-rec", getallRec);
router.get("/all-rec-month", getReclamationCountByMonth);
router.get("/:id", getaRec);

module.exports = router;