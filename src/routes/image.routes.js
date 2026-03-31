const router = require("express").Router();
const upload = require("../middleware/multer.config");
const {
  uploadDoc,
  getUploadImage,
  deleteImage,
} = require("../controllers/image.controller");
const { verifyToken, isUser } = require("../middleware/auth.middleware");
router.get("/upload", verifyToken, isUser, getUploadImage);
router.post(
  "/upload",
  upload.single("image"),
  verifyToken,
  isUser,
  uploadDoc,
);
router.post("/delete", verifyToken, isUser, deleteImage);

module.exports = router;
