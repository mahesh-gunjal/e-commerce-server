const {
	createItem,
	queryItems,
	getItemById,
	updateItemById,
	deleteItemById
} = require("../../src/services/item.service");
const { Item } = require("../../src/models");
const ApiError = require("../../src/utils/ApiError");

// Import the fixtures
const itemFixture = require("../fixtures/item.service.fixture");

const {
	ItemFixture,
	ItemObjectFixture,
	ItemIdFixture
} = itemFixture;

// Mock the Item model
jest.mock("../../src/models/item.model");

describe("Item Service", () => {
	describe("createItem", () => {
		it("should create a new item", async () => {
			// Mock the static method 'create' of Image model
			const createSpy = jest.spyOn(Item, "create");
			Item.create.mockResolvedValue(ItemObjectFixture);

			const result = await createItem(ItemFixture);

			expect(createSpy).toHaveBeenCalledWith(ItemFixture);

			expect(result).toEqual(ItemObjectFixture);
		});
	});

	describe("queryItems", () => {
		it("should query items with filter and options", async () => {
			const filter = { name: "Test Item" };
			const options = { limit: 10, page: 1 };
			const mockPaginatedResult = {
				docs: [{ _id: "123", name: "Test Item" }],
				totalDocs: 1,
				limit: 10,
				page: 1
			};

			Item.paginate.mockResolvedValue(mockPaginatedResult);

			const result = await queryItems(filter, options);

			expect(Item.paginate).toHaveBeenCalledWith(filter, options);
			expect(result).toEqual(mockPaginatedResult);
		});
	});

	describe("getItemById", () => {
		it("should find an item by ID", async () => {
			Item.findById.mockResolvedValue(ItemObjectFixture);

			const result = await getItemById(ItemIdFixture);

			expect(Item.findById).toHaveBeenCalledWith(ItemIdFixture);
			expect(result).toEqual(ItemObjectFixture);
		});

		it("should return null if item is not found", async () => {
			Item.findById.mockResolvedValue(null);

			const result = await getItemById(ItemIdFixture);

			expect(Item.findById).toHaveBeenCalledWith(ItemIdFixture);
			expect(result).toBeNull();
		});
	});

	describe("updateItemById", () => {
		it("should update an item by ID", async () => {
			const mockItemObject = { ...ItemObjectFixture, save: jest.fn() };
			const mockItem = ItemFixture;

			// Mock the static method 'findById' of Image model
			const FindByIdSpy = jest.spyOn(Item, "findById");
			FindByIdSpy.mockResolvedValue(mockItemObject);
			const SaveSpy = jest.spyOn(Item.prototype, "save");
			SaveSpy.mockResolvedValue(mockItem);

			const result = await updateItemById(ItemIdFixture, ItemFixture);

			expect(Item.findById).toHaveBeenCalledWith(ItemIdFixture);

			expect(result).toMatchObject({ _id: mockItemObject._id, ...ItemFixture });

			// Restore the spies
			FindByIdSpy.mockRestore();
			SaveSpy.mockRestore();
		});

		it("should throw an error if the item is not found", async () => {
			Item.findById.mockResolvedValue(null);

			await expect(updateItemById(ItemIdFixture, ItemFixture)).rejects.toThrow(ApiError);
		});
	});

	describe("deleteItemById", () => {
		// it('should soft delete an item by ID', async () => {
		// 	// Create a spy for the 'findById' method
		// 	const findByIdSpy = jest.spyOn(Item, 'findById');

		// 	// Mock the 'findById' method to return a mock item
		// 	findByIdSpy.mockResolvedValue({ _id: ItemIdFixture, deleted: false });

		// 	const result = await deleteItemById(ItemIdFixture);

		// 	expect(findByIdSpy).toHaveBeenCalledWith(ItemIdFixture);
		// 	expect(result.deleted).toBe(true);

		// 	// Restore the spy
		// 	findByIdSpy.mockRestore();
		// });

		it("should throw an error if the item is not found", async () => {
			Item.findById.mockResolvedValue(null);

			await expect(deleteItemById(ItemIdFixture)).rejects.toThrow(ApiError);
		});
	});
});