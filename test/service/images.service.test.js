// tests/imageService.test.js

// Mock the 'fs' module
jest.mock("fs");
const fs = require("fs");
const {
	createImage,
	saveMultipleImages,
	getImageById,
	deleteImageById,
	readImage
} = require("../../src/services/image.service");
const { Image } = require("../../src/models");
const ApiError = require("../../src/utils/ApiError");
// Import the fixtures
const imageFixtures = require("../fixtures/images.service.fixture");

// Destructure the fixtures for easier access
const {
	imageFixture,
	imagesFixture,
	insertedIdsFixture,
	insertedImagesFixture,
	imageIdFixture,
	imageObjectFixture,
	mockImageContents
} = imageFixtures;

// Mock the Image model
jest.mock("../../src/models/image.model");

describe("imageService", () => {
	describe("createImage", () => {
		it("should create a new image", async () => {
			// Mock the static method 'create' of Image model
			const createSpy = jest.spyOn(Image, "create");
			createSpy.mockResolvedValue(imageObjectFixture);

			const result = await createImage(imageFixture);

			expect(createSpy).toHaveBeenCalledWith(imageFixture);
			expect(result).toEqual(imageObjectFixture);
		});
	});

	describe("saveMultipleImages", () => {
		it("should save multiple images and return inserted IDs", async () => {
			// Mock the behavior of the `saveImages` function to resolve with mockInsertedIds
			const saveImagesSpy = jest.spyOn(Image, "insertMany");
			saveImagesSpy.mockResolvedValue(insertedImagesFixture);

			// Call the saveMultipleImages function with the mockImages
			const result = await saveMultipleImages(imagesFixture);

			// Assert that saveImages was called with the expected image body
			expect(saveImagesSpy).toHaveBeenCalledWith(imagesFixture);

			// Assert that the result matches the expected mockInsertedIds
			expect(result).toEqual(insertedIdsFixture);
		});
	});

	describe("getImageById", () => {
		it("should find an image by ID", async () => {
			// Mock the static method 'findById' of Image model
			const findByIdSpy = jest.spyOn(Image, "findById");
			findByIdSpy.mockReturnValue(imageObjectFixture);

			const result = await getImageById(imageIdFixture);

			expect(findByIdSpy).toHaveBeenCalledWith(imageIdFixture);
			expect(result).toEqual(imageObjectFixture);
		});
	});

	describe("deleteImageById", () => {
		// it('should delete an image by ID', async () => {
		// 	// Mock the static method 'findById' of Image model
		// 	const findByIdSpy = jest.spyOn(Image, 'findById');
		// 	findByIdSpy.mockResolvedValue(imageObjectFixture);

		// 	// Mock the instance method 'delete'
		// 	const deleteSpy = jest.spyOn(Image, 'delete');
		// 	deleteSpy.mockResolvedValue(imageObjectFixture);

		// 	const result = await deleteImageById(imageIdFixture);

		// 	expect(findByIdSpy).toHaveBeenCalledWith(imageIdFixture);
		// 	expect(deleteSpy).toHaveBeenCalled();
		// 	expect(result).toEqual(imageObjectFixture);
		// });

		it("should throw an error if the image is not found", async () => {
			// Mock the static method 'findById' of Image model to return null
			const findByIdSpy = jest.spyOn(Image, "findById");
			findByIdSpy.mockResolvedValue(null);

			await expect(deleteImageById(imageIdFixture)).rejects.toThrow(ApiError);
		});
	});

	describe("readImage", () => {
		it("should read the contents of an image file", () => {
			// Mock 'fs.readFileSync' function
			jest.spyOn(fs, "readFileSync").mockReturnValue(mockImageContents);

			const result = readImage(imageFixture.filename);

			expect(result).toEqual(mockImageContents);
		});
	});
});