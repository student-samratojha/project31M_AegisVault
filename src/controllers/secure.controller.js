const userModel = require("../db/models/user.model");
const { auditLog } = require("./auth.controller");
const auditModel = require("../db/models/audit.model");
const imageModel = require("../db/models/image.model");
const { profile } = require("node:console");
async function getAdminDashboard(req, res) {
  try {
    const users = await userModel.find({ role: "user" });
    const audits = await auditModel
      .find()
      .populate("user", "name email")
      .sort({ time: -1 })
      .limit(10);
      const docs = await imageModel.find().populate("user", "name email").sort({ createdAt: -1 }).limit(10);
    res.render("adminDashboard", { users, admin: req.user, audits, docs });
  } catch (err) {
    console.error("Admin dashboard error:", err);
    await auditLog("Accessed admin dashboard - internal server error", req);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.body;
    const user = await userModel.findById(id);
    if (!user) {
      await auditLog("Deleted user failed - user not found", req);
      return res.status(404).json({ message: "User not found" });
    }
    user.isDeleted = true;
    await user.save();
    await auditLog("Deleted user successfully", req);
    res.redirect("/secure/admin?success=1");
  } catch (err) {
    console.error("Delete user error:", err);
    await auditLog("Deleted user failed - internal server error", req);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getUserDashboard(req, res) {
  try {
    const docs = await imageModel.find({ user: req.user._id, isDeleted: false }).sort({ createdAt: -1 });
    res.render("userDashboard", { user: req.user, docs });
  } catch (err) {
    console.error("User dashboard error:", err);
    await auditLog("Accessed user dashboard - internal server error", req);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function restoreUser(req, res) {
  try {
    const { id } = req.body;
    const user = await userModel.findById(id);
    if (!user) {
      await auditLog("Restored user failed - user not found", req);
      return res.status(404).json({ message: "User not found" });
    }
    user.isDeleted = false;
    await user.save();
    await auditLog("Restored user successfully", req);
    res.redirect("/secure/admin?success=1");
  } catch (err) {
    console.error("Restore user error:", err);
    await auditLog("Restored user failed - internal server error", req);
    res.status(500).json({ message: "Internal server error" });
  }
}
async function editUser(req, res) {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);
    if (!user) {
      await auditLog("Edit user failed - user not found", req);
      return res.redirect(`/secure/${req.user.role}?not_found=1`);
    }
    res.render("edit", { user });
  } catch (err) {
    console.error("Edit user error:", err);
    await auditLog("Edit user failed - internal server error", req);
    res.status(500).json({ message: "Internal server error" });
  }
}
async function getAdminProfile(req, res) {
  try {
    res.render("adminProfile", { admin: req.user });
    } catch (err) {
    console.error("Admin profile error:", err);
    await auditLog("Accessed admin profile - internal server error", req);
    res.status(500).json({ message: "Internal server error" });
  }
}
async function saveEditedUser(req, res) {
  try {
    const { name, id, email, city, country, bio } = req.body;
    const user = await userModel.findById(id);
    if (!user) {
      await auditLog("Save edited user failed - user not found", req);
      return res.redirect(`/secure/${req.user.role}?not_found=1`);
    }
    user.name = name || user.name;
    user.email = email || user.email;
    user.city = city || user.city;
    user.country = country || user.country;
    user.bio = bio || user.bio;
    
    if (req.file) {
      // Normalize path for web compatibility
      user.profilePic = req.file.path.replace(/\\/g, '/');
    }

    await user.save();
    await auditLog("Edited user saved successfully", req);
    res.redirect(`/secure/${req.user.role}?edit_success=1`);
  } catch (err) {
    console.error("Save edited user error:", err);
    await auditLog("Save edited user failed - internal server error", req);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getAdminDashboard,
  deleteUser,
  restoreUser,
  getUserDashboard,
  getAdminProfile,
  editUser,
  saveEditedUser,
};
