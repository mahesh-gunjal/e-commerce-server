// fixtures/image.fixtures.js

const faker = require("faker");

const imageFixture = {
	filename: faker.system.fileName(),
	path: faker.system.filePath()
};

const imagesFixture = [
	{
		filename: faker.system.fileName(),
		path: faker.system.filePath()
	},
	{
		filename: faker.system.fileName(),
		path: faker.system.filePath()
	}
];

const insertedIdsFixture = [faker.datatype.uuid(), faker.datatype.uuid()];

const insertedImagesFixture = insertedIdsFixture.map((id) => ({ _id: id }));

const imageIdFixture = faker.datatype.uuid();

const imageObjectFixture = {
	_id: imageIdFixture,
	filename: faker.system.fileName(),
	path: faker.system.filePath()
};

const mockImageContents = `Contents of ${imageFixture.filename}`;

module.exports = {
	imageFixture,
	imagesFixture,
	insertedIdsFixture,
	insertedImagesFixture,
	imageIdFixture,
	imageObjectFixture,
	mockImageContents
};