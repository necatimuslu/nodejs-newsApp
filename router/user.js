const express = require("express");
const router = express.Router();

const {
  getUserById,
  getAllUser,
  registerUser,
  loginUser,
  resetPassword,
  uploadImage,
  authCheck,
  forgotPassword,
} = require("../controllers/user");

router.get("/", getAllUser);
router.get("/profile/:id", getUserById);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/reset-password", resetPassword);
router.post("/forgot-password", forgotPassword);
router.post("/image-upload", authCheck, uploadImage);
module.exports = router;
