const { Order } = require("../models");

/**
 * Creates a new order.
 * @param  {Object} orderBody - information of order to create new order.
 * @returns {Promise<createOrder>}
 */
const createOrder = (orderBody) => Order.create(orderBody);

module.exports = { createOrder };