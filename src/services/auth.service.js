// dependencies
const httpStatus = require("http-status");
// utils
const ApiError = require("../utils/ApiError");
const { generatePassword } = require("../utils/password");
// service
const userService = require("./user.service");
const socialAuthService = require("./social.auth.service");

////////////////
//  register  //
////////////////

/**
 * Register a new user.
 * @param {Object} userBody - An object that contains the information needed to create a new user.
 * @returns {Promise<createUser>} - The createUser function is being returned.
 */
const registerUser = (userBody) => userService.createUser(userBody);

/**
 * Register user using google token.
 * @param {String} idToken - Google token.
 * @returns {Promise<createUser>} - The createUser function is being returned.
 */
const registerUserWithGoogle = async (idToken) => {
	const googleUser = await socialAuthService.verifyGoogleUser(idToken);
	const userBody = {
		name: googleUser.name,
		email: googleUser.email,
		mobile: null,
		password: generatePassword()
	};

	return userService.createUser(userBody);
};

/**
 * Register user using facebook token.
 * @param {String} idToken - Facebook token.
 * @returns {Promise<createUser>} - The createUser function is being returned.
 */
const registerUserWithFacebook = async (idToken) => {
	const facebookUser = await socialAuthService.verifyFacebookUser(idToken);
	const userBody = {
		name: facebookUser.name,
		email: facebookUser.email,
		mobile: null,
		password: generatePassword()
	};

	return userService.createUser(userBody);
};

/////////////
//  login  //
/////////////

/**
 * Verify user email and password for login.
 * @param {String} email - The `email` parameter is a string that represents the email address of the user.
 * @param {String} password - The `password` parameter is the password entered by the user.
 * @returns {User} - The user object if the email and password match.
 * @throws {ApiError} - If Password not matched.
 */
const loginUserWithEmailAndPassword = async (mobile, password) => {
	const User = await userService.getUserByMobile(mobile);
	if (!User || !(await User.isPasswordMatch(password))) {
		throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
	}
	return User;
};

/**
 * Login with Google
 * @param {string} idToken
 * @returns {Promise<user>}
 */
const loginWithGoogle = async (idToken) => {
	const googleUser = await socialAuthService.verifyGoogleUser(idToken);
	if (!googleUser.email || !googleUser.email_verified) {
		throw new ApiError(httpStatus.UNAUTHORIZED, "Google authentication failed");
	}
	const user = await userService.getUserByEmail(googleUser.email);
	if (!user) {
		throw new ApiError(httpStatus.UNAUTHORIZED, "This user does not exist");
	}
	return user;
};

/**
 * Login with Facebook
 * @param {string} idToken
 * @returns {Promise<user>}
 */
const loginWithFacebook = async (idToken) => {
	const facebookUser = await socialAuthService.verifyFacebookUser(idToken);

	const user = await userService.getUserByEmail(facebookUser.email);
	if (!user) {
		throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
	}
	return user;
};

/**
 * The function `socialLogin` allows users to log in using either Google or Facebook and returns the
 * user information.
 * @param {string} provider - The social media platform used for login. It can be either "google" or "facebook".
 * @param {string} idToken - The `idToken` parameter is a token.
 * @returns The function `socialLogin` returns the `user` object.
 */
const socialLogin = async (provider, idToken) => {
	let user;
	switch (provider) {
		case "google":
			user = await loginWithGoogle(idToken);
			break;
		case "facebook":
			user = await loginWithFacebook(idToken);
			break;
		default:
			throw new ApiError(httpStatus.NOT_FOUND, ` ${provider} Provider Not Found`);
	}
	return user;
};



module.exports = {
	registerUser,
	registerUserWithGoogle,
	registerUserWithFacebook,
	loginUserWithEmailAndPassword,
	socialLogin
};