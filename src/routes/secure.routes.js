const router = require("express").Router();
const { verifyToken,isUser, isAdmin } = require("../middleware/auth.middleware");
const {
  getAdminDashboard,
  deleteUser,
  restoreUser,
  saveEditedUser,
  getUserDashboard,
  editUser,
} = require("../controllers/secure.controller");
const { getAdminProfile } = require("../controllers/secure.controller");
const upload = require("../middleware/multer.config");
router.get("/profile", verifyToken, isAdmin, getAdminProfile);
router.get("/admin", verifyToken, isAdmin, getAdminDashboard);
router.post("/delete", verifyToken, isAdmin, deleteUser);
router.post("/restore", verifyToken, isAdmin, restoreUser);
router.get("/user", verifyToken, isUser, getUserDashboard);
router.get("/edit/:id", verifyToken, editUser);
router.post("/edit", upload.single("profilePic"), verifyToken, saveEditedUser);
module.exports = router;