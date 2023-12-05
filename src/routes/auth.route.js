// dependencies
const express = require("express");
// middleware
const validate = require("../middlewares/validate");
// validator
const authValidation = require("../validations/auth.validation");
// controller
const authController = require("../controllers/auth.controller");

const router = express.Router();

// Routes: register user
router.post("/register/user", validate(authValidation.registerUser), authController.registerUser);
router.post("/register/user/:provider", validate(authValidation.socialLogin), authController.socialRegistration);
// Routes: register admin
router.post("/register/admin", validate(authValidation.registerAdmin), authController.registerAdmin);
// Router: Login admin, user
router.post("/login", validate(authValidation.login), authController.login);
router.post("/login/admin", validate(authValidation.login), authController.AdminLogin);
router.post("/social/login/:provider/admin", validate(authValidation.socialLogin), authController.socialAdminLogin);
router.post("/social/login/:provider", validate(authValidation.socialLogin), authController.socialUserLogin);


module.exports = router;