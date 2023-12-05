/* eslint-disable consistent-return */
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { tokenService, userService } = require("../services");

// Access token authentication middleware
const auth = (role) => async (req, _res, next) => {
	try {
		const authHeader = req.headers.authorization;
		const token = authHeader && authHeader.split(" ")[1];

		// check access token
		if (!token) {
			next(new ApiError(httpStatus.UNAUTHORIZED, "Please add Access Token."));
		}
		// if token exists then verify
		const payload = await tokenService.verifyToken(token);

		// get user
		const user = await userService.getUserByID(payload.sub);

		// if user deleted or not found
		if (!user) {
			next(new ApiError(httpStatus.FORBIDDEN, "Forbidden"));
		}

		// check role for route access
		if (role && role !== user.role) {
			next(new ApiError(httpStatus.FORBIDDEN, "Forbidden"));
		}

		// set user
		req.user = user;
		next();
	} catch (err) {
		next(new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate"));
	}
};



module.exports = auth;