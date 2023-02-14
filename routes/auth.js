const { check } = require("express-validator");
const { validateSignup } = require("../validation/signup-validation");
const { validateLogin } = require("../validation/login-validation");
const { validateReset } = require("../validation/reset-validation");
const express = require("express");
const authController = require("../controllers/auth");
const router = express.Router();

router.get("/login", authController.getLogin);
router.post("/login", validateLogin, authController.postLogin);

router.get("/signup", authController.getSignUp);
router.post("/signup", validateSignup, authController.postSignUp);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);
router.post("/reset", validateReset, authController.postReset);

router.get("/reset/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);

module.exports = router;
