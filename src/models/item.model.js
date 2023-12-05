const mongoose = require("mongoose");
const { paginate, privates, softDelete } = require("./plugins");

const itemSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true
		},
		price: {
			type: Number,
			require: true
		},
		unit: {
			type: String,
			require: true
		},
		description: { type: String },
		images: [
			{
				type: mongoose.Schema.ObjectId,
				ref: "images"
			}
		],
		createdBy: {
			type: mongoose.Schema.ObjectId,
			ref: "user"
		}
	},
	{ timestamps: true }
);

// apply plugins on schema
itemSchema.plugin(paginate);
itemSchema.plugin(privates);
itemSchema.plugin(softDelete);

/**
 * @typedef Items
 */
const Items = mongoose.model("items", itemSchema);



module.exports = Items;