/* eslint-disable no-console */
// Node App starts here

const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config/environment");
const logger = require("./config/logger");

let server;
console.log("\x1b[34m%s\x1b[0m", "------------------------------------------------------");
console.log("\x1b[34m%s\x1b[0m", `info: Node Environment => ${config.env}`);
console.log("\x1b[34m%s\x1b[0m", "------------------------------------------------------");

mongoose.set("strictQuery", true);

// Connect to MongoDB using mongoose
mongoose.connect(config.mongoose.url, config.mongoose.options).then((_db) => {
	console.log("\x1b[36m%s\x1b[1m", "------------------------------------------------------");
	console.log("\x1b[36m%s\x1b[0m", `info: Connected to MongoDB => ${config.mongoose.url}`);
	server = app.listen(config.port, () => {
		console.log("\x1b[36m%s\x1b[0m", "------------------------------------------------------");
		console.log("\x1b[32m%s\x1b[0m", `info: Node server listening on port => ${config.port}`);
		console.log("\x1b[36m%s\x1b[0m", "------------------------------------------------------");
	});
});

// Manually close the server if an unhandled exception occurs
const exitHandler = () => {
	if (server) {
		server.close(() => {
			logger.info("Server closed");
			process.exit(1);
		});
	} else {
		process.exit(1);
	}
};

const unexpectedErrorHandler = (error) => {
	logger.error(error);
	exitHandler();
};

// Listen to unhandled exceptions and call handler when such exceptions occur
process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

// Close the server if command received to close the server.
// E.g. Node process killed by OS or by the user using kill, pkill, task manager, etc.
process.on("SIGTERM", () => {
	logger.info("SIGTERM received");
	if (server) {
		server.close();
	}
});