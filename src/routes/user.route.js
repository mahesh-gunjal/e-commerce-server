// dependencies
const express = require("express");
// middleware
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
// controller
const userController = require("../controllers/user.controller");
// validator
const userValidation = require("../validations/user.validation");

const router = express.Router();

// Token authentication for all routes defined in this file
router.use(auth());

// Routes: get one user, update user
router
	.route("/")
	.get(userController.getUser)
	.patch(validate(userValidation.updateUser), userController.updateUser);

// Routes: update password
router
	.route("/update-password")
	.put(validate(userValidation.updatePassword), userController.updatePassword);

// Routes: get address, create address
router
	.route("/address")
	.get(auth, userController.getAddress)
	.post(auth, validate(userValidation.createAddress), userController.addAddress);

// Routes: delete address
router
	.route("/address/:addressId")
	.delete(validate(userValidation.deleteAddress), userController.deleteAddress);

module.exports = router;