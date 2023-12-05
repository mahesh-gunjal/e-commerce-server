// utils
const asyncRequest = require("../utils/requestHandler");
// services
const { imageService } = require("../services");

const getImage = asyncRequest(async (req, res) => {
	const image = await imageService.readImage(req.params.imageName);
	res.setHeader("Content-Type", "image/jpeg");
	res.end(image);
});



module.exports = { getImage };