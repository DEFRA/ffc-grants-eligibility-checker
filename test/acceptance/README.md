# Acceptance Tests
This directory contains the acceptance tests for the FFC Grant Eligibility Checker. The framework used is WebdriverIO with Cucumber and the tests are containerised, running against a single browser (Chrome).

## Environment Variables
Provide the following environment variables, typically in a `.env` file in the `/test/acceptance` directory:

```
TEST_ENVIRONMENT_ROOT_URL=http://host.docker.internal:3000
```

When the tests are run by Jenkins the `TEST_ENVIRONMENT_ROOT_URL` variable is generated and exposed by the pipeline to point to the PR-specific sandbox deployment. 

## Running tests inside a container
This is how the tests run in the Jenkins pipeline. Docker services are created for the tests and the Selenium instance of Chrome. Headless browser mode is used.

- For ARM architectures, change the Selenium image used in `docker-compose.yaml`:

```dockerfile
  selenium:
    image: selenium/standalone-chrome
  # CHANGES TO..
  selenium:
    image: seleniarm/standalone-chromium
```   

- If running against a local instance of the application ensure the application is running, typically with `docker-compose up --build` from the root folder of the repository.

- From the `/test/acceptance` directory run `docker-compose run --build --rm wdio-cucumber`. This will run all acceptance tests.

## Running tests outside a container
To run tests outside a container, with the browser interaction visible run `npm run test`. To run a specific test or tests with a tag use the following command in `/test/acceptance`.

```
npx wdio run ./wdio.conf.js --cucumberOpts.tags=@tag
```

## Parallelization
Tests are run in parallel at feature file level at default. This is controlled by the `maxInstances` property in `wdio.conf.js`:

```js
maxInstances: 3,
```

## Running tests against multiple browsers
Tests can be run against multiple browsers by specifying additional capabilities together with more instances in `wdio.conf.js`:

```js
maxInstances: 3,
capabilities: [
    { acceptInsecureCerts: true, browserName: 'chrome' },
    { acceptInsecureCerts: true, browserName: 'firefox' },
    { acceptInsecureCerts: true, browserName: 'edge' }
],
```

## Reports
The HTML report is written to `/test/acceptance/html-reports`.