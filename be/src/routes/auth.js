const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");

//router.post('/register', authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/refresh-token", authController.refreshToken);
//router.post('/refresh', authController.refreshToken);

module.exports = router;
