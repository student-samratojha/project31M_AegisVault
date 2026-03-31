const userModel = require("../db/models/user.model");
const imageModel = require("../db/models/image.model");
const auditModel = require("../db/models/audit.model");
const { auditLog } = require("./auth.controller");

async function getUploadImage(req, res) {
  try {
    res.render("uploadImage", { user: req.user });
  } catch (err) {
    console.error(err);
    await auditLog("Accessed image upload page - internal server error", req);
    res.status(500).send("Internal server error");
  }
}

async function uploadDoc(req, res) {
  try {
    const { title, description } = req.body;

    if (!req.file) {
      await auditLog("Image upload failed - no file selected", req);
      return res.redirect("/secure/user?upload_error=1");
    }

    const newImage = new imageModel({
      user: req.user._id,
      title,
      description,
      imageUrl: req.file.path.replace(/\\/g, '/'),
    });

    await newImage.save();

    await auditLog("Image uploaded successfully", req);

    res.redirect("/secure/user?upload_success=1");
  } catch (err) {
    console.error(err);
    await auditLog("Image upload failed - internal server error", req);
    res.status(500).send("Internal server error");
  }
}

async function deleteImage(req, res) {
  try {
    const { id } = req.body;
    const doc = await imageModel.findById(id);
    if (!doc) {
      await auditLog("Delete image failed - image not found", req);
      return res.redirect("/secure/user?delete_error=1");
    }
    doc.isDeleted = true;
    await doc.save();
    await auditLog("Image deleted successfully", req);
    res.redirect("/secure/user?deleted=1");
  } catch (err) {
    console.error(err);
    await auditLog("Delete image failed", req);
    res.status(500).send("Internal server error");
  }
}

module.exports = {
  getUploadImage,
  uploadDoc,
  deleteImage,
};
