const jwt = require("jsonwebtoken");
const userModel = require("../db/models/user.model");
const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.clearCookie("token");
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.userId);
    if (!user || user.isDeleted) {
      res.clearCookie("token");
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.clearCookie("token");
    return res.status(401).json({ message: "Invalid token" });
  }
};

const isAdmin = (req, res, next) => {
  try {
    if (req.user && req.user.role === "admin") {
      return next();
    }
    res.clearCookie("token");
    return res.status(403).json({ message: "Forbidden" });
  } catch (err) {
    res.clearCookie("token");
    return res.status(403).json({ message: "Forbidden" });
  }
};

const isUser = (req, res, next) => {
  try {
    if (req.user && req.user.role === "user") {
      return next();
    }
    res.clearCookie("token");
    return res.status(403).json({ message: "Forbidden" });
  } catch (err) {
    res.clearCookie("token");
    return res.status(403).json({ message: "Forbidden" });
  }
};

module.exports = {
  verifyToken,
  isAdmin,
  isUser,
};
