const userModel = require("../db/models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auditModel = require("../db/models/audit.model");
async function auditLog(action, req) {
  try {
    await auditModel.create({
      user: req.user?._id || null,
      action,
      ip: req.ip,
      route: req.originalUrl,
      method: req.method,
      userAgent: req.get("User-Agent"),
    });
  } catch (err) {
    console.error("Audit log error:", err);
  }
}

async function getRegister(req, res) {
  res.render("register");
}

async function postRegister(req, res) {
  try {
    const { name, email, password } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      await auditLog("Registration failed - email already exists", req);
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ name, email, password: hashedPassword });
    await newUser.save();
    await auditLog("User registered successfully", req);
    res.redirect("/auth/login?success=1");
  } catch (err) {
    console.error("Registration error:", err);
    await auditLog("Registration failed - internal server error", req);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getLogin(req, res) {
  res.render("login");
}

async function postLogin(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      await auditLog("Login failed - user not found", req);
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (user.isDeleted) {
      await auditLog("Login failed - user is deleted", req);
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      await auditLog("Login failed - invalid password", req);
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    res.cookie("token", token, { httpOnly: true });
    await auditLog("User logged in successfully", req);
    res.redirect(`/secure/${user.role}?Welcome=${user.role}`);
  } catch (err) {
    console.error("Login error:", err);
    await auditLog("Login failed - internal server error", req);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function logout(req, res) {
  try {
    res.clearCookie("token");
    await auditLog("User logged out successfully", req);
    res.redirect("/auth/login?logout=1");
  } catch (err) {
    console.error("Logout error:", err);
    await auditLog("Logout failed - internal server error", req);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getRegister,
  postRegister,
  getLogin,
  auditLog,
  postLogin,
  logout,
};
