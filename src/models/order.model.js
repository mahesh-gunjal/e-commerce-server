const mongoose = require("mongoose");
const { paginate, softDelete, privates } = require("./plugins");

const statusType = {
	placed: "placed",
	preparing: "preparing",
	readyToDeliver: "readyToDeliver",
	deliver: "deliver",
	canceled: "canceled"
};

const orderSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.ObjectId,
			ref: "user"
		},
		alternativeContact: {
			type: Number,
			require: true
		},
		address: {
			type: mongoose.Types.ObjectId,
			ref: "address"
		},
		items: [
			{
				item: {
					type: mongoose.Types.ObjectId,
					ref: "items"
				},
				quantity: {
					type: Number,
					require: true
				}
			}
		],
		status: {
			type: String,
			enum: Object.keys(statusType),
			default: "placed"
		}
	},
	{ timestamps: true }
);

// apply plugins on schema
orderSchema.plugin(paginate);
orderSchema.plugin(privates);
orderSchema.plugin(softDelete);

/**
 * @typedef Order
 */
const Order = mongoose.model("orders", orderSchema);

module.exports = Order;