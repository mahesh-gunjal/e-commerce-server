const {
	registerUser,
	registerUserWithGoogle,
	registerUserWithFacebook,
	loginUserWithEmailAndPassword,
	socialLogin
} = require("../../src/services/auth.service");

const userService = require("../../src/services/user.service"); // Replace with the actual path to your user service
const socialAuthService = require("../../src/services/social.auth.service"); // Replace with the actual path to your social auth service

// Mock the userService.createUser function
jest.mock("../../src/services/user.service", () => ({
	createUser: jest.fn(),
	getUserByMobile: jest.fn(),
	getUserByEmail: jest.fn()
}));

// Mock the socialAuthService.verifyGoogleUser and socialAuthService.verifyFacebookUser functions
jest.mock("../../src/services/social.auth.service", () => ({
	verifyGoogleUser: jest.fn(),
	verifyFacebookUser: jest.fn()
}));

describe("User Authentication Module", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("registerUser", () => {
		it("should register a user successfully", async () => {
			// Mock the userService.createUser function to return a fake user
			userService.createUser.mockResolvedValueOnce({
				name: "Test User",
				email: "test@example.com",
				mobile: "1234567890",
				password: "password123"
			});

			// Create a fake userBody object for testing
			const userBody = {
				name: "Test User",
				email: "test@example.com",
				mobile: "1234567890",
				password: "password123"
			};

			// Call the registerUser function
			const result = await registerUser(userBody);

			// Assertions
			expect(result).toEqual(userBody);
			expect(userService.createUser).toHaveBeenCalledWith(userBody);
		});
	});

	describe("registerUserWithGoogle", () => {
		it("should register a user with Google successfully", async () => {
			// Mock the socialAuthService.verifyGoogleUser function to return a fake user
			socialAuthService.verifyGoogleUser.mockResolvedValueOnce({
				name: "Google User",
				email: "google@example.com"
			});

			// Mock the userService.createUser function to return a fake user
			userService.createUser.mockResolvedValueOnce({
				name: "Google User",
				email: "google@example.com",
				mobile: null,
				password: "generatedPassword"
			});

			// Call the registerUserWithGoogle function
			const result = await registerUserWithGoogle("googleIdToken");

			// Assertions
			expect(result.name).toBe("Google User");
			expect(result.email).toBe("google@example.com");
			expect(userService.createUser).toHaveBeenCalledWith({
				name: "Google User",
				email: "google@example.com",
				mobile: null,
				password: expect.any(String) // Password should be generated
			});
		});
	});

	describe("registerUserWithFacebook", () => {
		it("should register a user with Facebook successfully", async () => {
			// Mock the socialAuthService.verifyFacebookUser function to return a fake user
			socialAuthService.verifyFacebookUser.mockResolvedValueOnce({
				name: "Facebook User",
				email: "facebook@example.com"
			});

			// Mock the userService.createUser function to return a fake user
			userService.createUser.mockResolvedValueOnce({
				name: "Facebook User",
				email: "facebook@example.com",
				mobile: null,
				password: "generatedPassword"
			});

			// Call the registerUserWithFacebook function
			const result = await registerUserWithFacebook("facebookIdToken");

			// Assertions
			expect(result.name).toBe("Facebook User");
			expect(result.email).toBe("facebook@example.com");
			expect(userService.createUser).toHaveBeenCalledWith({
				name: "Facebook User",
				email: "facebook@example.com",
				mobile: null,
				password: expect.any(String) // Password should be generated
			});
		});
	});

	describe("loginUserWithEmailAndPassword", () => {
		it("should login a user with valid credentials", async () => {
			// Mock the userService.getUserByMobile function to return a fake user
			userService.getUserByMobile.mockResolvedValueOnce({
				mobile: "7219550690",
				isPasswordMatch: jest.fn().mockResolvedValueOnce(true)
			});

			// Call the loginUserWithEmailAndPassword function
			const result = await loginUserWithEmailAndPassword("7219550690", "password123");

			// Assertions
			expect(result.mobile).toBe("7219550690");
			expect(result.isPasswordMatch).toHaveBeenCalled();
		});

		it("should throw an error for invalid credentials", async () => {
			// Mock the userService.getUserByMobile function to return null
			userService.getUserByMobile.mockResolvedValueOnce(null);

			// Call the loginUserWithEmailAndPassword function with invalid credentials
			await expect(loginUserWithEmailAndPassword("7219550690", "invalidPassword")).rejects.toThrowError(
				"Incorrect email or password"
			);
		});
	});

	describe("loginWithGoogle", () => {
		it("should login with Google successfully", async () => {
			// Mock the socialAuthService.verifyGoogleUser function to return a fake user
			socialAuthService.verifyGoogleUser.mockResolvedValueOnce({
				name: "Google User",
				email: "google@example.com",
				email_verified: true
			});

			// Mock the userService.getUserByEmail function to return a fake user
			userService.getUserByEmail.mockResolvedValueOnce({
				name: "Google User",
				email: "google@example.com"
			});

			// Call the loginWithGoogle function
			const result = await socialLogin("google", "googleIdToken");

			// Assertions
			expect(result.name).toBe("Google User");
			expect(result.email).toBe("google@example.com");
		});

		it("should throw an error for unverified Google account", async () => {
			// Mock the socialAuthService.verifyGoogleUser function to return an unverified user
			socialAuthService.verifyGoogleUser.mockResolvedValueOnce({
				name: "Google User",
				email: "google@example.com",
				email_verified: false
			});

			// Call the loginWithGoogle function with an unverified Google account
			await expect(socialLogin("google", "googleIdToken")).rejects.toThrowError("Google authentication failed");
		});

		it("should throw an error for a non-existing user", async () => {
			// Mock the socialAuthService.verifyGoogleUser function to return a fake user
			socialAuthService.verifyGoogleUser.mockResolvedValueOnce({
				name: "Google User",
				email: "google@example.com",
				email_verified: true
			});

			// Mock the userService.getUserByEmail function to return null (user doesn't exist)
			userService.getUserByEmail.mockResolvedValueOnce(null);

			// Call the loginWithGoogle function with a non-existing user
			await expect(socialLogin("google", "googleIdToken")).rejects.toThrowError("This user does not exist");
		});
	});

	describe("loginWithFacebook", () => {
		it("should login with Facebook successfully", async () => {
			// Mock the socialAuthService.verifyFacebookUser function to return a fake user
			socialAuthService.verifyFacebookUser.mockResolvedValueOnce({
				name: "Facebook User",
				email: "facebook@example.com"
			});

			// Mock the userService.getUserByEmail function to return a fake user
			userService.getUserByEmail.mockResolvedValueOnce({
				name: "Facebook User",
				email: "facebook@example.com"
			});

			// Call the loginWithFacebook function
			const result = await socialLogin("facebook", "facebookIdToken");

			// Assertions
			expect(result.name).toBe("Facebook User");
			expect(result.email).toBe("facebook@example.com");
		});

		it("should throw an error for a non-existing user", async () => {
			// Mock the socialAuthService.verifyFacebookUser function to return a fake user
			socialAuthService.verifyFacebookUser.mockResolvedValueOnce({
				name: "Facebook User",
				email: "facebook@example.com"
			});

			// Mock the userService.getUserByEmail function to return null (user doesn't exist)
			userService.getUserByEmail.mockResolvedValueOnce(null);

			// Call the loginWithFacebook function with a non-existing user
			await expect(socialLogin("facebook", "facebookIdToken")).rejects.toThrowError("Incorrect email or password");
		});
	});
});