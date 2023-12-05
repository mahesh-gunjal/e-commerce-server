const multer = require("multer");

// Set up Multer storage to store uploaded images in the 'uploads' folder.
const storage = multer.diskStorage({
	destination: (_req, _file, cb) => {
		cb(null, "uploads/");
	},
	filename: (_req, file, cb) => {
		cb(null, `${Date.now()}-${file.originalname}`);
	}
});

const multerInstance = multer({ storage });

module.exports = { multerInstance };