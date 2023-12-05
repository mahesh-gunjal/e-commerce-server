# Node.JS Boilerplate - JavaScript RESTful APIs

A production ready boilerplate/starter project for quickly building RESTful APIs using Node.js, Express, and Mongoose. Authentication using JWT, request validation, API documentation, pagination, etc. For more details, check the features list below.

## Quick Start

You may need to make the `.env` file and set environment variables in it.
Refer `.env.example`

## Dependencies Installation

Run the following command.

```bash
npm install
```

or

```bash
yarn install 
```

## Table of Contents

- [Features](#features)
- [Commands](#commands)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Error Handling](#error-handling)
- [Validation](#validation)
- [Authentication](#authentication)
- [Logging](#logging)
- [Custom Mongoose Plugins](#custom-mongoose-plugins)
- [Linting](#linting)
- [Contributing](#contributing)

## Functionalities

- **Database**: [MongoDB](https://www.mongodb.com) object data modeling using [Mongoose](https://mongoosejs.com)
- **Authentication and authorization**: using [jwt](https://jwt.io/)
- **Validation**: request data validation using [Joi](https://github.com/hapijs/joi)
- **Logging**: using [winston](https://github.com/winstonjs/winston) and [morgan](https://github.com/expressjs/morgan)
- **Error handling**: error handling mechanism is centralized
- **Process management**: advanced production process management using [PM2](https://pm2.keymetrics.io)
- **Dependency management**: with [NPM](https://nodejs.dev/learn/an-introduction-to-the-npm-package-manager)
- **Environment variables**: using [dotenv](https://github.com/motdotla/dotenv) and [cross-env](https://github.com/kentcdodds/cross-env#readme)
- **Security**: set security HTTP headers using [helmet](https://helmetjs.github.io)
- **Sanitizing**: sanitize request data against xss and query injection
- **CORS**: Cross-Origin Resource-Sharing enabled using [cors](https://github.com/expressjs/cors)
- **Compression**: gzip compression with [compression](https://github.com/expressjs/compression)
- **CI**: continuous integration with [Travis CI](https://travis-ci.org)
- **Git hooks**: with [husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/okonet/lint-staged)
- **Linting**: with [ESLint](https://eslint.org)

## Commands 

Running locally:

```bash
npm run dev
```

Running in production:

```bash
npm start
```

Testing:

```bash
# run all tests
npm run test

# run all tests in watch mode
npm run test:watch

# run test coverage
npm run coverage
```

Linting:

```bash
# run ESLint
npm run lint

# fix ESLint errors
npm run lint:fix
```

## Environment Variables

The environment variables can be found and modified in the `.env` file. They come with these default values:

```bash
# Node server port number
PORT=8080
NODE_ENV=

# Frontend Site URL
SITE_URL=

# URL of the Mongo DB
MONGODB_URL=

# Recaptcha secret key
RECAPTCHA_SECRET=

# AWS S3 Bucket Config
AWS_S3_BUCKET=
AWS_S3_REGION=
AWS_S3_ACCESS_KEY_ID=
AWS_S3_SECRET_ACCESS_KEY=

# Social Login
GOOGLE_CLIENT_ID=
FACEBOOK_APP_ID=

# JWT
# JWT secret key
JWT_SECRET=
# Number of minutes after which an access token expires default 1440 minutes i.e. 24 hours
JWT_ACCESS_EXPIRATION_MINUTES=1440

# Email configuration
# Service Provider => smtp, sendgrid, aws
EMAIL_PROVIDER=smtp

# Service Provider Key ID => Only for AWS SES mailer
EMAIL_PROVIDER_KEY_ID=NA

# Service Provider Key => Only for sendgrid and aws mailer
EMAIL_PROVIDER_KEY=NA

# SMTP configuration options for the email service
# For testing, you can use a fake SMTP service like Ethereal: https://ethereal.email/create
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USERNAME=something@ethereal.email
SMTP_PASSWORD=email-password
EMAIL_FROM=no-reply@processmanager.io
```

## Project Structure

```
uploads\            # Uploaded images 
src\
 |--config\         # Environment variables and configuration related things
 |--controllers\    # Route controllers (controller layer)
 |--docs\           # Swagger files
 |--middlewares\    # Custom express middlewares
 |--models\         # Mongoose models (data layer)
 |--routes\         # Routes
 |--services\       # Business logic (service layer)
 |--utils\          # Utility classes and functions
 |--validations\    # Request data validation schemas
 |--app.js          # Express app
 |--index.js        # App entry point
```

### API Endpoints

List of routes added by default: 

**Auth routes**:\
`POST /auth/register` - register\
`POST /auth/login` - login\
`POST /auth/forgot-password` - send reset password email\
`POST /auth/reset-password` - reset password\

## Error Handling

The app has a centralized error handling mechanism.

Controllers should try to catch the errors and forward them to the error handling middleware (by calling `next(error)`). For convenience, you can also wrap the controller inside the catchAsync utility wrapper, which forwards the error.

```javascript
const requestAsync = require('../utils/requestHandler');

const controller = requestAsync(async (req, res) => {
  // this error will be forwarded to the error handling middleware
  throw new Error('Something wrong happened');
});
```

The error handling middleware sends an error response, which has the following format:

```json
{
  "code": 404,
  "message": "Not found"
}
```

When running in development mode, the error response also contains the error stack.

The app has a utility ApiError class to which you can attach a response code and a message, and then throw it from anywhere (catchAsync will catch it).

For example, if you are trying to get a user from the DB who is not found, and you want to send a 404 error, the code should look something like:

```javascript
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');

const getUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
};
```

## Validation

Request data is validated using [Joi](https://joi.dev/). Check the [documentation](https://joi.dev/api/) for more details on how to write Joi validation schemas.

The validation schemas are defined in the `src/validations` directory and are used in the routes by providing them as parameters to the `validate` middleware.

```javascript
const express = require('express');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router.post('/users', validate(userValidation.createUser), userController.createUser);
```

## Authentication

To require authentication for certain routes, you can use the `auth` middleware.

```javascript
const express = require('express');
const auth = require('../../middlewares/auth');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router.post('/users', auth.auth, userController.createUser);
```

These routes require a valid JWT access token in the Authorization request header using the Bearer schema. If the request does not contain a valid access token, an Unauthorized (401) error is thrown.

**Generating Access Tokens**:

An access token can be generated by making a successful call to the login (`POST /auth/login`) endpoints.

An access token is valid for 1440 minutes (24 hours). You can modify this expiration time by changing the `JWT_ACCESS_EXPIRATION_MINUTES` environment variable in the .env file.

## Logging

Import the logger from `src/config/logger.js`. It is using the [Winston](https://github.com/winstonjs/winston) logging library.

Logging should be done according to the following severity levels (ascending order from most important to least important):

```javascript
const logger = require('<path to src>/config/logger');

logger.error('message'); // level 0
logger.warn('message'); // level 1
logger.info('message'); // level 2
logger.http('message'); // level 3
logger.verbose('message'); // level 4
logger.debug('message'); // level 5
```

In development mode, log messages of all severity levels will be printed to the console.

In production mode, only `info`, `warn`, and `error` logs will be printed to the console.\
It is up to the server (or process manager) to actually read them from the console and store them in log files.\
This app uses pm2 in production mode, which is already configured to store the logs in log files.

Note: API request information (request url, response code, timestamp, etc.) are also automatically logged (using [morgan](https://github.com/expressjs/morgan)).

## Custom Mongoose Plugins

The app also contains 3 custom mongoose plugins that you can attach to any mongoose model schema. You can find the plugins in `src/models/plugins`.

```javascript
const mongoose = require('mongoose');
const { private, paginate, softDelete } = require('./plugins');

const userSchema = mongoose.Schema(
  {
    /* schema definition here */
  },
  { timestamps: true }
);

userSchema.plugin(softDelete);
userSchema.plugin(private);
userSchema.plugin(paginate);

const User = mongoose.model('User', userSchema);
```

### private

The private plugin applies the following changes in the private transform call:

- removes \_\_v, and any schema path that has private: true

### softDelete

The softDelete plugin adds additional delete methods to the mongoose schema to not permanently delete records, instead add a deleted flag. This plugin also overrides `find`, `count` and `countDocuments` methods of mongoose schema to eliminate records having deleted flag true. 

### paginate

The paginate plugin adds the `paginate` static method to the mongoose schema.

Adding this plugin to the `User` model schema will allow you to do the following:

```javascript
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};
```

The `filter` param is a regular mongo filter.

The `options` param can have the following (optional) fields:

```javascript
const options = {
  sortBy: 'name:desc', // sort order
  limit: 5, // maximum results per page
  page: 2, // page number
  populate: [{ 
    path: "_org", 
    select: "name email" 
  }] // array of fields to populate with field path and fields to select
};
```

The plugin also supports sorting by multiple criteria (separated by a comma): `sortBy: name:desc,role:asc`

The `paginate` method returns a Promise, which fulfills with an object having the following properties:

```json
{
  "results": [],
  "page": 2,
  "limit": 5,
  "totalPages": 10,
  "totalResults": 48
}
```


## Linting

Linting is done using [ESLint](https://eslint.org/).

To modify the ESLint configuration, update the `.eslintrc.json` file.

To prevent a certain file or directory from being linted, add it to `.eslintignore`.