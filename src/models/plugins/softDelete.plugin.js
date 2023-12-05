/* eslint-disable import/no-extraneous-dependencies */
/**
 * A mongoose schema plugin uses mongoose-delete npm package to soft delete documents
 */

const softDelete = (schema) => {
	// eslint-disable-next-line global-require
	schema.plugin(require("mongoose-delete"),
		{ overrideMethods: ["count", "countDocuments", "find"] });
};

module.exports = softDelete;