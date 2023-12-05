const Joi = require("joi");
const { password, mongoID } = require("./custom.validation");

const updateUser = {
	body: Joi.object().keys({
		name: Joi.string().required(),
		email: Joi.string().allow(""),
		mobile: Joi.string().required()
	})
};

const updatePassword = {
	body: Joi.object().keys({
		oldPassword: Joi.string().required(),
		newPassword: Joi.string().required().custom(password)
	})
};


const createAddress = {
	params: Joi.object().keys({ userId: Joi.required().custom(mongoID) }),
	body: Joi.object().keys({
		line1: Joi.string().required(),
		line2: Joi.string().allow(""),
		city: Joi.string().required(),
		state: Joi.string().required(),
		pinCode: Joi.number().required()
	})
};

const deleteAddress = {
	params: Joi.object().keys({
		userId: Joi.required().custom(mongoID),
		addressId: Joi.required().custom(mongoID)
	})
};



module.exports = { updateUser, updatePassword, createAddress, deleteAddress };