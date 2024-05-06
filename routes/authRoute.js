const express = require("express");
const { createUser, loginUserCtrl,getAdmin,resetPassword,getallUsersExceptAdminAndEmployees, getallUser, getaUser, getClientCountByMonth,getallUsersaufemployees,deleteaUser, handleRefreshToken, updateUser, forgotPasswordToken, logout, blockUser, editEmployee, getAllEmployeesWithLessThanTenTasks, unblockUser, getallUserPartners, getallUserclient, getallUserEmployees } = require("../controller/userCtrl");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUserCtrl);

router.get("/all-user", getallUser);
router.get("/all-user-partner", getallUserPartners);
router.get("/all-user-client", getallUserclient);
router.get("/admin", getAdmin);
router.get("/all-user-employee", getallUserEmployees);
router.get("/all-user-saufemployee", getallUsersaufemployees);
router.get("/all-user-saufemployeeAdmin", getallUsersExceptAdminAndEmployees);
router.get("/all-user-taskemployee", getAllEmployeesWithLessThanTenTasks);
router.put("/:id", updateUser);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.put("/block-user/:id", authMiddleware, blockUser);
router.put("/unblock-user/:id", authMiddleware, unblockUser);
router.get("/:id", getaUser);
router.post("/forgot-password-token", forgotPasswordToken);
// Route pour réinitialiser le mot de passe
router.put("/reset-password/:token", resetPassword);
router.delete("/:id", deleteaUser);
router.put("/:id", editEmployee);
router.get('/clients/count-by-month',getClientCountByMonth);

module.exports = router;
