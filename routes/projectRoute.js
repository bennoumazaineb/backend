const express = require("express");
const { createProject,updateProject,getallProject,getAllProjectsByClient,createProjectTask,getProjectCountByMonth,getaProject,deleteProjet}= require('../controller/projectCtrl')

const router =express.Router();
router.post("/addproject",createProject);
router.post("/addtask",createProjectTask);
router.get("/all-project", getallProject);
router.put("/:id",updateProject);
router.get("/getAproj/:id", getaProject);
router.delete("/:id",deleteProjet)
router.get('/project-count-by-month', getProjectCountByMonth);
router.get("/clientProject",getAllProjectsByClient);
module.exports = router;