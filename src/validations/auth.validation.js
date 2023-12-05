const Joi = require("joi");
const { password } = require("./custom.validation");

const registerUser = {
	body: Joi.object().keys({
		name: Joi.string().required(),
		email: Joi.string().allow(""),
		mobile: Joi.number().required(),
		password: Joi.string().required().custom(password),
		address: Joi.object().keys({
			line1: Joi.string().required(),
			line2: Joi.string().allow(""),
			city: Joi.string().required(),
			state: Joi.string().required(),
			pinCode: Joi.number().required()
		})
	})
};

const registerAdmin = {
	body: Joi.object().keys({
		name: Joi.string().required(),
		email: Joi.string().required(),
		mobile: Joi.number().required(),
		password: Joi.string().required().custom(password)
	})
};

const login = {
	body: Joi.object().keys({
		mobile: Joi.number().required(),
		password: Joi.string().required()
	})
};

const socialLogin = { body: Joi.object().keys({ token: Joi.string().required() }) };



module.exports = { registerUser, registerAdmin, login, socialLogin };