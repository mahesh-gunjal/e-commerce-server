/**
 * The randomChar function returns a random character from a given string.
 * @param {String} characters - string that contains character to select.
 * @returns {character} - random character from provided string.
 */
const randomChar = (characters) => {
	const randomIndex = Math.floor(Math.random() * characters.length);
	return characters.charAt(randomIndex);
};

/**
 * Shuffle characters of given string.
 * @param {String} string - String.
 * @returns {String}
 */
const shuffleString = (string) => {
	const array = string.split("");
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		// eslint-disable-next-line security/detect-object-injection
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array.join("");
};

/**
 * Generate random password
 * @return {String} - random string
 */
const generatePassword = () => {
	const length = Math.floor(Math.random() * 11) + 6;
	const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
	const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const numericChars = "0123456789";
	const specialChars = "!@#$%^&*?";

	const allChars = lowercaseChars + uppercaseChars + numericChars + specialChars;

	let password = "";

	// Ensure at least one character from each category
	password += randomChar(lowercaseChars) + randomChar(uppercaseChars) + randomChar(numericChars) + randomChar(specialChars);

	// Generate the remaining characters
	for (let i = 4; i < length; i++) {
		password += randomChar(allChars);
	}

	return shuffleString(password);
};



module.exports = { generatePassword };