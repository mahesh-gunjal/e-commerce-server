// dependencies
const express = require("express");
// controller
const imageController = require("../controllers/image.controller");

const router = express.Router();

router.route("/:imageName").get(imageController.getImage);

module.exports = router;