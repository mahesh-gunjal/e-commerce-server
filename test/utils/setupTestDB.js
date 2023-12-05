const mongoose = require("mongoose");
const config = require("../../src/config/environment");

const setupTestDB = () => {
	beforeAll(async () => {
		await mongoose.connect(config.mongoose.url, config.mongoose.options);
	});

	beforeEach(async () => {
		// eslint-disable-next-line no-return-await
		await Promise.all(Object.values(mongoose.connection.collections).map(async (collection) => await collection.deleteMany()));
	});

	afterAll(async () => {
		await mongoose.disconnect();
	});
};



module.exports = setupTestDB;