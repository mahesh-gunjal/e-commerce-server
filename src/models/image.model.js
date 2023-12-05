const mongoose = require("mongoose");
const { privates } = require("./plugins");

const imageSchema = mongoose.Schema(
	{
		filename: {
			type: String,
			required: true
		},
		path: {
			type: String,
			required: true
		}
	},
	{ timestamps: true }
);

// plugins
imageSchema.plugin(privates);

/**
 * @typedef Image
 */
const Image = mongoose.model("images", imageSchema);



module.exports = Image;