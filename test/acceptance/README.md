# Acceptance Tests
This folder contains the acceptance test project for the Grants Eligibility Checker web app. The framework used is WebdriverIO with Cucumber and the tests are containerised by default, running against a single browser (Chrome).
.
## Requirements
- Docker
- Node
- npm

## Environment Variables
Provide the following environment variables in a `.env` file in the `/test/acceptance` directory:

```pwsh
TEST_ENVIRONMENT_ROOT_URL
```

When the tests are run by Jenkins the `TEST_ENVIRONMENT_ROOT_URL` variable is generated and exposed by the pipeline to point to the PR-specific Sandbox deployment. 

## Running tests inside a container (default)
Docker is used to create containers for both the tests (`wdio-cucumber`) and the Selenium instance of Chrome (`chrome-browser`).

1. For ARM architectures, change the image used for Chrome in `docker-compose.yaml`:

```
  selenium:
    image: selenium/standalone-chrome

CHANGES TO..

  selenium:
    image: seleniarm/standalone-chromium
```   

2. If running against `localhost` ensure the application container is running with `docker-compose up --build` from the root folder of this repository.

3. From the `/test/acceptance` directory run `docker-compose run --build --rm wdio-cucumber`. This will run all tests.

5. HTML reports will be output to `./reports`.

## Running tests outside a container
To run the tests outside a container:

1. Comment out `hostname` and `port` in `wdio.conf.js`, i.e.:
```js
exports.config = {
    //hostname: 'selenium',
    //port: 4444,```
```
2. Run `npm run test`, this will execute the following script defined in `package.json`:
```pwsh
npx wdio run ./wdio.conf.js
```

3. Run a specific test or tests with a tag:
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