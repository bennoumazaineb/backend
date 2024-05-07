const express = require("express");
const {  createFacture,getAllFacture,deleteFacture,updateFacturePaymentStatus} = require("../controller/factureCtrl");
const router = express.Router();

router.post("/register", createFacture);
router.get("/all", getAllFacture);
router.delete("/:id", deleteFacture);
router.put('/factures/:id', updateFacturePaymentStatus);


module.exports = router;