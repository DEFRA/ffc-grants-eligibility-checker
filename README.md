# FFC Grants Eligibility Checking

This project is a flexible and easy-to-use **Form Builder** designed to simplify the process of creating, customizing,
and managing eligibility checkers. It leverages **Hapi.js** for the backend framework, with strong code standards
enforced using **eslint** and **prettier**. The project is developed with **Node.js** (v20.x and above).

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

## Environment Variables

Environment variables for the application in **all environments**:

| Variable                               | Description                                         | Helm configuration                                          | Default                             |
| -------------------------------------- | --------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------- |
| `NODE_ENV`                             | The environment the application is running in       |                                                             | `production`                        |
| `LOG_LEVEL`                            | The level of logging to use                         |                                                             | `info`                              |
| `LOG_OUTPUT`                           | The output of the logs                              |                                                             | `stdout`                            |
| `LOG_PRETTY`                           | Whether to pretty print logs                        |                                                             | `true`                              |
| `SERVICE_BUS_HOST`                     | The host of the service bus                         | `{{ .Values.container.messageQueueHost }}`                  | `localhost`                         |
| `SCORE_REQUEST_QUEUE_ADDRESS`          | The address of the score request queue              | `{{ .Values.container.scoreRequestQueueAddress }}`          | `ffc-grants-score-request`          |
| `SCORE_RESPONSE_QUEUE_ADDRESS`         | The address of the score response queue             | `{{ .Values.container.scoreResponseQueueAddress }}`         | `ffc-grants-score-response`         |
| `DESIRABILITY_SUBMITTED_TOPIC_ADDRESS` | The address of the desirability submitted topic     | `{{ .Values.container.desirabilitySubmittedTopicAddress }}` | `ffc-grants-desirability-submitted` |
| `NOTIFY_EMAIL_TEMPLATE`                | The email template for the notify service           | `{{ .Values.container.notifyEmailTemplate }}`               | `ffc-grants-eligibility-checker`    |
| `SESSION_CACHE_TTL`                    | The TTL in millis for the cookie and cache          | N/A                                                         |
| `COOKIE_PASSWORD`                      | The password needed for authorizing the cookies     | N/A                                                         |
| `REDIS_HOSTNAME`                       | The hostname needed for connecting to Azure Redis   | N/A                                                         |                                     |
| `REDIS_PORT`                           | The port needed for connecting to Azure Redis       | N/A                                                         |                                     |
| `REDIS_PASSWORD`                       | The password needed for connecting to Azure Redis   | N/A                                                         |                                     |
| `REDIS_PARTITION`                      | The name of the application, needed for Azure Redis | ffc-grants-eligibility-checker                              |                                     |

Environment variables for the application in **development**:

| Variable | Description                          | Default     |
| -------- | ------------------------------------ | ----------- |
| `HOST`   | The host the application will run on | `localhost` |
| `PORT`   | The port the application will run on | `3000`      |

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

Note: Please make sure you define the following `.env` file for the in memory catbox caching (to configure redis please follow the docker-compose.override.yaml setup - see \*\*Run the local server)

```
NODE_ENV=development
#PLATFORM=linux/arm64
SESSION_CACHE_TTL=3600000
COOKIE_PASSWORD="thisistestcookiepasswordthisistestcookiepasswordthisistestcookiepassword"
USE_REDIS=false
PORT=3000
```

This will start the Hapi.js server and your project will be available at
`http://localhost:3000/eligibility-checker/<checker_name>`.

**Code Linting & Formatting**

Lint your code with **eslint**:

```bash
npm run lint
```

Format code with **prettier**:

```bash
npm run format
```

**Run tests (unit and narrow integration) locally**

```bash
  npm test
```

This will run all `jest` unit (`/src/**/*`), narrow integration tests (`test/integration/narrow/**/*`) and full integration tests (`test/integration/full`).

**Run tests (unit, narrow and full integration) locally in a container (to mirror Jenkins)**

```bash
docker-compose -f docker-compose.yaml -f docker-compose.test.yaml run ffc-grants-eligibility-checker
```

**Docker**

```bash
    docker-compose up --build
```

In order to start docker compose locally for ARM arch you need to uncomment PLATFORM env variables:

```
PLATFORM=<linux/amd64|linux/arm64>
```

There are two local configs at the moment:

- docker-compose.test.yaml - config for narrow integration tests (development as target)
- docker-compose.override.yaml - config for smoke testing (includes reverse proxy and main service built with production as target)

To start it on local:

```
docker-compose -f docker-compose.yaml -f docker-compose.override.yaml up --build
```

This requires a url of: http://localhost/eligibility-checker/example-grant/start (omits the port)

**Authorise Snyk**

Run `snyk auth` to authenticate your local machine with Snyk.

## Project Structure

- `src/` – Core application files (routes, handlers, etc.)
- `public/` – Frontend assets
- `test/` – Integration and Acceptance tests

## Pipeline

The pipeline uses both Jenkins and Azure DevOps (ADO) due to historical reasons. Refer to the documentation links below for more details on the setup of each. When a pull request (PR) is raised or updated, tests are executed. Upon merging the PR into the main branch, tests run again and a container is built, which is then deployed through environments with various gates as outlined below:

| Step | Jenkins         | ADO            | Gate       | App Config                  |
| ---- | --------------- | -------------- | ---------- | --------------------------- |
| 1    | Build - test    |                | no         | NA                          |
| 2    | Build Container |                | no         | NA                          |
| 3    | Deploy to SND   |                | no         | Manual in Azure App config  |
| 4    |                 | Deploy to DEV  | no         | Automatic via platform repo |
| 5    |                 | Deploy to TEST | yes - team | Automatic via platform repo |
| 6    |                 | Deploy to PRE  | yes - team | Automatic via platform repo |
| 7    |                 | Deploy to PROD | yes - CCOE | Automatic via platform repo |

**Further Documentation**

[FCP Jenkins](https://defra.github.io/ffc-development-guide/create-a-new-service/jenkins/)

[FCP ADO](https://defra.github.io/ffc-development-guide/create-a-new-service/ado/)
