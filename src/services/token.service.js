const jwt = require("jsonwebtoken");
const moment = require("moment");
const config = require("../config/environment");

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId, expires, secret = config.jwt.secret) => {
	const payload = {
		sub: userId,
		iat: moment().unix(),
		exp: expires.unix()
	};
	return jwt.sign(payload, secret);
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = (token, secret = config.jwt.secret) => jwt.verify(token, secret);

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = (user) => {
	const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, "minutes");
	const accessToken = generateToken(user.id, accessTokenExpires);

	return {
		token: accessToken,
		expires: accessTokenExpires.toDate()
	};
};



module.exports = {
	generateToken,
	verifyToken,
	generateAuthTokens
};