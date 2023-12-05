const fs = require("fs");
const path = require("path");
const httpStatus = require("http-status");
const { Image } = require("../models");
const ApiError = require("../utils/ApiError");

/**
 * Create a new image.
 * @param {Object} imageBody - The image to create.
 * @returns {Promise<Image>} - The created image.
 */
const createImage = (image) => {
	const imageBody = {
		filename: image.filename,
		path: image.path
	};
	return Image.create(imageBody);
};

/**
 * Create a new images.
 * @param {Object} imageBody - The images to create.
 * @returns {Promise<Image>} - The created images.
 */
const saveImages = (images) => Image.insertMany(images);

/**
 * Insert multiple images.
 * @param {ObjectId} images - Images
 * @returns {Array<id>} - The inserted image.
 */
const saveMultipleImages = async (images) => {
	const imageBody = [];
	await images.forEach((image) => {
		imageBody.push({
			filename: image.filename,
			path: image.path
		});
	});
	const result = await saveImages(imageBody);

	// Extract the inserted IDs from the inserted documents
	const insertedIds = result.map((doc) => doc._id);

	return insertedIds;
};

/**
 * Find an image by ID.
 * @param {ObjectId} id - The ID of the image to find.
 * @returns {Promise<Image>} - The found image.
 */
const getImageById = (id) => Image.findById(id);

/**
 * Delete an image by ID.
 * @param {ObjectId} imageId - The ID of the image to delete.
 * @returns {Promise<Image>} - The deleted image.
 * @throws {ApiError} - If the image is not found.
 */
const deleteImageById = async (imageId) => {
	const image = await getImageById(imageId);
	if (!image) {
		throw new ApiError(httpStatus.BAD_REQUEST, "image not found");
	}
	await image.delete();
	return image;
};

/**
 * Reads and returns the contents of an image file.
 * @param filename - The filename parameter name of the file.
 * @returns
 */
const readImage = (filename) => {
	const imagePath = path.join(__dirname, "./../../uploads/", filename);
	// eslint-disable-next-line security/detect-non-literal-fs-filename
	return fs.readFileSync(imagePath);
};



module.exports = {
	readImage,
	createImage,
	getImageById,
	deleteImageById,
	saveMultipleImages
};