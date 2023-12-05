// dependencies
const httpStatus = require("http-status");
// utils
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const asyncRequest = require("../utils/requestHandler");
// services
const { itemService, imageService } = require("../services");

// Create a new item
const createItem = asyncRequest(async (req, res) => {
	req.body.images = await imageService.saveMultipleImages(req.files);
	req.body.createdBy = req.user._id;
	const item = await itemService.createItem(req.body);
	res.status(httpStatus.CREATED).send(item);
});

// Get items based on filter and options
const getItems = asyncRequest(async (req, res) => {
	const filter = pick(req.query, ["name"]);
	const options = pick(req.query, ["sortBy", "limit", "page"]);
	const result = await itemService.queryItems(
		// eslint-disable-next-line security/detect-non-literal-regexp
		{ ...filter, $or: [{ name: new RegExp(req.query.search, "gi") }] },
		{ ...options, populate: [{ path: "images", select: "_id filename path" }] }
	);
	res.status(httpStatus.OK).send(result);
});

// Get a specific item
const getItem = asyncRequest(async (req, res) => {
	const item = await itemService.getItemById(req.params.itemId);
	if (!item) {
		throw new ApiError(httpStatus.BAD_REQUEST, "Item not found");
	}
	res.status(httpStatus.OK).send(item);
});

// Update an existing item
const updateItem = asyncRequest(async (req, res) => {
	const item = await itemService.updateItemById(req.params.itemId, req.body);
	res.status(httpStatus.OK).send(item);
});

// Delete an item
const deleteItem = asyncRequest(async (req, res) => {
	await itemService.deleteItemById(req.params.itemId);
	res.status(httpStatus.NO_CONTENT).send();
});



module.exports = { createItem, getItems, getItem, updateItem, deleteItem };