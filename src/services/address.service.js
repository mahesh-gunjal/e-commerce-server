const httpStatus = require("http-status");
const { Address } = require("../models");
const ApiError = require("../utils/ApiError");

/**
 * Creates a new order.
 * @param  {Object} addressBody - address.
 * @returns {Promise<createAddress>}
 */
const createAddress = (addressBody) => Address.create(addressBody);

/**
 * Creates a new order.
 * @param  {ObjectId} addressID - addressId.
 * @returns {Promise<findById>}
 */
const getAddressById = (addressID) => Address.findById(addressID);

/**
 * Creates a new order.
 * @param  {ObjectId} userId -
 * @returns {Promise<findMany<user:userId>>}
 */
const getAddressByUserId = (userId) => Address.findMany({ user: userId });

/**
 * Creates a new order.
 * @param  {ObjectId} addressId -
 * @returns {address}
 */
const deleteAddress = async (addressId) => {
	const address = await getAddressById(addressId);
	if (!address) {
		throw new ApiError(httpStatus.NOT_FOUND, "address not found!");
	}
	await address.delete();
	return address;
};



module.exports = { createAddress, getAddressByUserId, deleteAddress };