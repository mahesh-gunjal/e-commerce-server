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


## Linting

Linting is done using [ESLint](https://eslint.org/).

To modify the ESLint configuration, update the `.eslintrc.json` file.

To prevent a certain file or directory from being linted, add it to `.eslintignore`.
