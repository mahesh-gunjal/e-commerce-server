/**
 *
 * Verify is given value if valid mongoDB ID or not.
 * @param value - The `value` parameter represents  a MongoDB ID.
 * @param helpers - The `helpers` parameter is a helper functions provided by the validation library.
 * @returns the input value if it is a valid MongoDB ID.
 */
const mongoID = (value, helpers) => {
	if (!value.match(/^[0-9a-fA-F]{24}$/)) {
		return helpers.message("\"{{#label}}\" must be a valid mongo id");
	}
	return value;
};

/**
 * Validate Password with certain criteria.
 * @param value - The `value` parameter represents the password that needs to be validated.
 * @param helpers - The `helpers` parameter is an helper functions that can be used within the validation function.
 * @returns The code is returning a message indicating the requirements for a valid password.
 */
const password = (value, helpers) => {
	if (value.length < 6) {
		return helpers.message("{{#label}} must have length 6 characters");
	}
	if (!value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{6,16}$/)) {
		return helpers.message("{{#label}} must contains 1 Uppercase, 1 lowercase, 1 Special character, 1 number");
	}
	return value;
};



module.exports = { mongoID, password };