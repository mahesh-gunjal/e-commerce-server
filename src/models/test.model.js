const mongoose = require("mongoose");
const validator = require("validator");
const { paginate } = require("./plugins");

const testSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true
		},
		email: {
			type: String,
			trim: true,
			lowercase: true,
			validate(value) {
				if (!validator.isEmail(value)) {
					throw new Error("Invalid email");
				}
			}
		},
		mobile: {
			type: Number,
			require: true
		},
		address: {
			line1: {
				type: String,
				require: true
			},
			line2: { type: String },
			city: {
				type: String,
				require: true
			},
			state: {
				type: String,
				require: true
			},
			pinCode: {
				type: Number,
				require: true
			}
		}
	},
	{ timestamps: true }
);

// apply plugins on schema
testSchema.plugin(paginate);

/**
 * @typedef Test
 */
const Test = mongoose.model("test", testSchema);

module.exports = Test;