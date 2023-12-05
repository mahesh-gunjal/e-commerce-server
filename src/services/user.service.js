const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { User } = require("../models");

/**
 * The function `createUser` creates a new user
 * @param {Object} userBody - The `userBody` parameter is an object
 * @returns {Promises<createUser>} result of the User.create() method.
 */
const createUser = (userBody) => User.create(userBody);

/**
 * get user using email.
 * @param {String} UserEmail - email address.
 * @returns {User} user
 */
const getUserByEmail = (UserEmail) => {
	const user = User.findOne({ email: UserEmail });
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, "user not found !");
	}
	return user;
};

/**
 * get user using Mobile.
 * @param {String} UserMobile - Mobile.
 * @returns {User} user
 */
const getUserByMobile = (UserMobile) => {
	const user = User.findOne({ mobile: UserMobile });
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, "user not found !");
	}
	return user;
};

/**
 * Get the user with that ID.
 * @param {ObjectId} id - The `id` parameter is the unique identifier of a user.
 * @returns {Promise<User>} - Return user for Id.
 */
const getUserByID = (id) => User.findById(id);

/**
 *  updates a user by their ID with the provided user data.
 * @param {ObjectId} userId - The `userId` parameter is the unique identifier of the user.
 * @param {Object} userBody - The `userBody` parameter is an object that contains the updated information.
 * @returns {User} the updated user object.
 */
const updateUserById = async (userId, userBody) => {
	const user = await getUserByID(userId);
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, "user not found");
	}
	Object.assign(user, userBody);
	await user.save();
	return user;
};

/**
 * The function updates the password of a user.
 * @param {ObjectId} userId - The `userId` parameter is the unique identifier of the user.
 * @param {Object} body - The `body` parameter is an object that contains the request body data.
 * @returns {User} - Updated user
 * @throws {ApiError} - If the Old password not matched.
 */
const updatePassword = async (userId, body) => {
	const user = await getUserByID(userId);
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, "user not found");
	}
	if (!user.isPasswordMatch(body.oldPassword)) {
		throw new ApiError(httpStatus.UNAUTHORIZED, "Old password not matched");
	}
	return updateUserById(userId, { password: body.newPassword });
};



module.exports = { createUser, getUserByEmail, getUserByMobile, updateUserById, getUserByID, updatePassword };