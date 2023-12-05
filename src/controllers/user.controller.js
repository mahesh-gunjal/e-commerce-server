// dependencies
const httpStatus = require("http-status");
// utils
const asyncRequest = require("../utils/requestHandler");
// services
const { userService, addressService } = require("../services");

const getUser = asyncRequest((req, res) => {
	res.status(httpStatus.OK).send({ user: req.user });
});

const updateUser = asyncRequest(async (req, res) => {
	const user = await userService.updateUserById(req.user._id, req.body);
	res.status(httpStatus.ACCEPTED).send(user);
});

const updatePassword = asyncRequest(async (req, res) => {
	const user = await userService.updatePassword(req.user._id, req.body);
	res.status(httpStatus.ACCEPTED).send(user);
});

const getAddress = asyncRequest(async (req, res) => {
	const address = await addressService.getAddressByUserId(req.user.userId);
	res.status(httpStatus.ACCEPTED).send(address);
});

const addAddress = asyncRequest(async (req, res) => {
	await addressService.createAddress({ user: req.user.userId, ...req.body });
	res.status(httpStatus.ACCEPTED).send();
});

const deleteAddress = asyncRequest(async (req, res) => {
	await addressService.deleteAddress(req.params.addressId);
	res.status(httpStatus.NO_CONTENT).send();
});



module.exports = { updateUser, getUser, updatePassword, getAddress, addAddress, deleteAddress };