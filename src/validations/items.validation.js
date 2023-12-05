const Joi = require("joi");
const { mongoID } = require("./custom.validation");

const createItem = {
	body: Joi.object().keys({
		name: Joi.string().required(),
		price: Joi.number().required(),
		unit: Joi.string().required(),
		description: Joi.string().allow("")
	})
};

const getItem = { params: Joi.object().keys({ itemId: Joi.string().custom(mongoID) }) };

const getItems = {
	query: Joi.object().keys({
		search: Joi.string().allow(""),
		sortBy: Joi.string(),
		limit: Joi.number().integer(),
		page: Joi.number().integer()
	})
};

const updateItem = {
	params: Joi.object().keys({ itemId: Joi.required().custom(mongoID) }),

	body: Joi.object()
		.keys({
			name: Joi.string().required(),
			price: Joi.number().required(),
			unit: Joi.string().required(),
			description: Joi.string().allow("")
		})
};

const deleteItem = { params: Joi.object().keys({ itemId: Joi.string().custom(mongoID) }) };



module.exports = {
	createItem,
	getItem,
	getItems,
	updateItem,
	deleteItem
};