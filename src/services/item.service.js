const httpStatus = require("http-status");
const { Item } = require("../models");
const ApiError = require("../utils/ApiError");

/**
 * Create a new item.
 * @param {Object} itemBody - The item to create.
 * @returns {Promise<Item>} - The created item.
 */
const createItem = (itemBody) => Item.create(itemBody);

/**
 * Query for items in the database.
 * @param {Object} filter - A MongoDB filter to limit the results.
 * @param {Object} options - Options for pagination and sorting.
 * @param {string} [options.sortBy] - The field to sort by and the direction.
 * @param {number} [options.limit] - The maximum number of items to return.
 * @param {number} [options.page] - The current page of items.
 * @returns {Promise<QueryResult<Item>>} - The paginated results of the query.
 */
const queryItems = async (filter, options) => {
	const items = await Item.paginate(filter, options);
	return items;
};

/**
 * Find an item by ID.
 * @param {ObjectId} id - The ID of the item to find.
 * @returns {Promise<Item>} - The found item.
 */
const getItemById = (id) => Item.findById(id);

/**
 * Update an item by ID.
 * @param {ObjectId} itemId - The ID of the item to update.
 * @param {Object} updateBody - The new values for the item.
 * @returns {Promise<Item>} - The updated item.
 * @throws {ApiError} - If the item is not found.
 */
const updateItemById = async (itemId, updateBody) => {
	const item = await getItemById(itemId);
	if (!item) {
		throw new ApiError(httpStatus.BAD_REQUEST, "item not found");
	}
	Object.assign(item, updateBody);
	await item.save();
	return item;
};

/**
 * Delete an item by ID.
 * @param {ObjectId} itemId - The ID of the item to delete.
 * @returns {Promise<Item>} - The deleted item.
 * @throws {ApiError} - If the item is not found.
 */
const deleteItemById = async (itemId) => {
	const item = await getItemById(itemId);
	if (!item) {
		throw new ApiError(httpStatus.BAD_REQUEST, "item not found");
	}
	await item.delete();
	return item;
};



module.exports = {
	createItem,
	queryItems,
	getItemById,
	updateItemById,
	deleteItemById
};