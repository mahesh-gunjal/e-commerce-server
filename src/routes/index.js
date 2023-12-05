// dependencies
const express = require("express");

const router = express.Router();
// routes
const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const itemRoute = require("./item.route");

// Routes index
const defaultRoutes = [
	{
		path: "/auth",
		route: authRoute
	},
	{
		path: "/user",
		route: userRoute
	},
	{
		path: "/item",
		route: itemRoute
	}
];

defaultRoutes.forEach((route) => {
	router.use(route.path, route.route);
});

module.exports = router;