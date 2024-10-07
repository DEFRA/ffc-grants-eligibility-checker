# FFC Grants Eligibility Checking

This project is a flexible and easy-to-use **Form Builder** designed to simplify the process of creating, customizing, and managing eligibility checkers. It leverages **Hapi.js** for the backend framework, with strong code standards enforced using **eslint** and **prettier**. The project is developed with **Node.js** (v20.x and above).

## Features
- Dynamic form creation
- Field validation and customisation
- API-based form submission and management
- Configurable questions

## Prerequisites
Ensure you have the following installed on your local machine:
- **Node.js** >= 20.x
- **NPM**

## Contributing

- This repository follows a trunk based development git model. (https://trunkbaseddevelopment.com/).
- All commits must be verified (signed) and pushes will be rejected without them.
- All PRs must be reviewed by at least one other developer before merging.
- All PRs must pass the CI/CD pipeline before merging.

## Local Development Setup

**Install dependencies**
```bash
  npm install
```

**Run the development server**

In development, we use `NODE_ENV=development`
```bash
  npm start
```

This will start the Hapi.js server and your project will be available at `http://localhost:3000/eligibility-checker/<checker_name>`.

**Code Linting & Formatting**
    
- Lint your code with **eslint**:
  ```bash
  npm run lint
  ```
  
- Format code with **prettier**:
  ```bash
  npm run format
  ```
      
**Run tests**

```bash
  npm test
```

This will run all `jest` unit tests inline with the code they're testing in `/src/**/*`

**Docker**

```bash
    docker-compose up --build
```

In order to start docker compose locally for ARM arch you need to uncomment PLATFORM env variables:

```
PLATFORM=<linux/amd64|linux/arm64>
```

**Authorise Snyk**

Run `snyk auth` to authenticate your local machine with Snyk.

## Project Structure

- `src/` – Core application files (routes, handlers, etc.)
- `public/` – Frontend assets (if applicable)
- `test/` – Unit and integration tests
