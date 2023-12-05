// item.fixtures.js

const faker = require("faker");

const ItemFixture = {
	name: faker.commerce.productName(),
	description: faker.lorem.sentence(),
	price: faker.datatype.number({ min: 1, max: 100 })
};
const ItemIdFixture = faker.datatype.uuid();
const ItemObjectFixture = { _id: ItemIdFixture, ...ItemFixture };

module.exports = {
	ItemObjectFixture,
	ItemFixture,
	ItemIdFixture
};