# Acceptance Tests
This folder contains the acceptance test project for the Grants Eligibility Checker web app. The framework used is WebdriverIO with Cucumber and the tests are containerised, running against a single browser (Chrome).
.
## Requirements
- Docker
- Node
- npm

## Environment Variables
Provide the following environment variables, typically in a `.env` file in the `/test/acceptance` directory:

```pwsh
TEST_ENVIRONMENT_ROOT_URL
```

When the tests are run by Jenkins the `TEST_ENVIRONMENT_ROOT_URL` variable is generated and exposed by the pipeline to point to the PR-specific Sandbox deployment. 

## Running tests inside a container
Docker is used to create containers for both the tests and the Selenium instance of Chrome. This is how the tests run in the Jenkins pipeline. Headless browser mode is used.

1. For ARM architectures, change the image used for Chrome in `docker-compose.yaml`:

```dockerfile
  selenium-cucumber:
    image: selenium/standalone-chrome

# CHANGES TO..

  selenium-cucumber:
    image: seleniarm/standalone-chromium
```   

2. If running against `localhost` ensure the application container is running with `docker-compose up --build` from the root folder of the repository.

3. From the `/test/acceptance` directory run `docker-compose run --build --rm wdio-cucumber`. This will run all acceptance tests.

5. HTML reports will be output to `/test/acceptance/html-reports`.

## Running tests outside a container
To run tests outside a container, with the browser interaction visible:

1. Run `npm run test`, this will run all tests by executing the following script defined in `package.json`:
```pwsh
npx wdio run ./wdio.conf.js
```

2. Run a specific test or tests with a tag:
```pwsh
npx wdio run ./wdio.conf.js --cucumberOpts.tags=@tag
```

## Running tests in parallel
Tests can be run in parallel at feature file level by increasing the number of instances available to WebdriverIO in `wdio.conf.js`, e.g.:
```js
maxInstances: 3,
```

## Running tests against multiple browsers
Tests can be run against multiple browsers by specifying additional capabilities together with more instances in `wdio.conf.js`:
```js
maxInstances: 10,
capabilities: [
    { acceptInsecureCerts: true, browserName: 'chrome' },
    { acceptInsecureCerts: true, browserName: 'firefox' },
    { acceptInsecureCerts: true, browserName: 'edge' }
],
```