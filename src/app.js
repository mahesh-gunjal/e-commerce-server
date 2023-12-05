// dependencies
const express = require("express");
const compression = require("compression");
const cors = require("cors");
const helmet = require("helmet");
const httpStatus = require("http-status");
const path = require("path");
// config
const config = require("./config/environment");
const morgan = require("./config/morgan");
// util
const ApiError = require("./utils/ApiError");
// middleware
const { errorConverter, errorHandler } = require("./middlewares/error");
// routes
const routes = require("./routes");							// business routes
// const imageRoutes = require('./routes/images.route');	// image routes

const app = express();

if (config.env !== "test") {
	app.use(morgan.successHandler);
	app.use(morgan.errorHandler);
}

app.use(
	helmet(), 								// Set necessary HTTP headers for app security.
	express.json(), 						// JSON requests are received as plain text. We need to parse the json request body.
	express.urlencoded({ extended: true }),	// Parse urlencoded request body if provided with any of the requests
	compression() 							// Using gzip compression for faster transfer of response data.
);

// Enable cors to accept requests from any frontend domain, all possible HTTP methods, and necessary items in request headers
app.use(cors());
app.options("*", cors());

// Serve the 'uploads' folder statically
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Define routes
app.use("/api", routes); 					// business routes

/** no need if hosting folder statically */
// app.use('/uploads', imageRoutes);		// images route

// Send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
	next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// Convert error to ApiError, if request was rejected or it throws an error
app.use(errorConverter);

// Handle the error
app.use(errorHandler);



module.exports = app;