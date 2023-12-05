// dependencies
const httpStatus = require("http-status");
// utils
const asyncRequest = require("../utils/requestHandler");
const ApiError = require("../utils/ApiError");
// services
const { authService, tokenService, addressService } = require("../services");

const registerUser = asyncRequest(async (req, res) => {
	const body = req.body;
	const userBody = {
		name: body.name,
		email: body.email,
		mobile: body.mobile,
		password: body.password,
		role: "user"
	};
	const user = await authService.registerUser(userBody);
	const address = await addressService.createAddress({ ...body.address, user: user._id });
	res.status(httpStatus.CREATED).send({ user, address });
});

const registerAdmin = asyncRequest(async (req, res) => {
	req.body.role = "admin";
	const user = await authService.registerUser(req.body);
	res.status(httpStatus.CREATED).send(user);
});

const login = asyncRequest(async (req, res) => {
	const { mobile, password } = req.body;
	const user = await authService.loginUserWithEmailAndPassword(mobile, password);
	if (user.role !== "user") {
		throw new ApiError(httpStatus.UNAUTHORIZED, `You are not user`);
	}
	const { token, expires } = await tokenService.generateAuthTokens(user);
	res.status(httpStatus.ACCEPTED).send({ user, token, expires });
});

const AdminLogin = asyncRequest(async (req, res) => {
	const { mobile, password } = req.body;
	const user = await authService.loginUserWithEmailAndPassword(mobile, password);
	if (user.role !== "admin") {
		throw new ApiError(httpStatus.UNAUTHORIZED, `You are not admin`);
	}
	const { token, expires } = await tokenService.generateAuthTokens(user);
	res.status(httpStatus.ACCEPTED).send({ user, token, expires });
});

const socialUserLogin = asyncRequest(async (req, res) => {
	const provider = req.params.provider.tolowercase();
	const idToken = req.body.token;
	const user = await authService.socialLogin(provider, idToken);
	if (user.role !== "user") {
		throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid login credential");
	}
	const { token, expires } = await tokenService.generateAuthTokens(user);
	res.status(httpStatus.ACCEPTED).send({ user, token, expires });
});

const socialAdminLogin = asyncRequest(async (req, res) => {
	const provider = req.params.provider.tolowercase();
	const idToken = req.body.token;
	const user = await authService.socialLogin(provider, idToken);
	if (user.role !== "admin") {
		throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid login credential");
	}
	const { token, expires } = await tokenService.generateAuthTokens(user);
	res.status(httpStatus.ACCEPTED).send({ user, token, expires });
});

const socialRegistration = asyncRequest(async (req, res) => {
	const provider = req.params.provider.tolowercase();
	const idToken = req.body.token;
	let user;
	switch (provider) {
		case "google":
			user = await authService.registerUserWithGoogle(idToken);
			break;
		case "facebook":
			user = await authService.registerUserWithFacebook(idToken);
			break;
		default:
			throw new ApiError(httpStatus.NOT_FOUND, ` ${provider} Provider Not Found`);
	}
	res.status(httpStatus.CREATED).send(user);
});



module.exports = { registerUser, registerAdmin, socialRegistration, login, AdminLogin, socialUserLogin, socialAdminLogin };