# Accessibility Tests
This folder contains the accessibility tests for the Grants Eligibility Checker web app. The framework used is WebdriverIO with Axe and the tests are containerised, running against a single browser (Chrome). The Defra design is to use axe-core cli, but this does not support posting and navigating through pages to move through the eligibility checker journey.
.
## Requirements
- Docker
- Node
- npm

## docker-compose file
The docker-compose file used is at the root of the repository, `docker-compose-axe.yaml`. This file is detected and executed by the Jenkins pipeline. The host base URL is defined in this file.

## Running tests
Docker is used to create containers for both the tests and the Selenium instance of Chrome. Headless browser mode is used.

1. For ARM architectures, change the image used for Chrome in `docker-compose.yaml`:

```dockerfile
  selenium-axe:
    image: selenium/standalone-chrome

# CHANGES TO..

  selenium-axe:
    image: seleniarm/standalone-chromium
```   

2. If running against `host.docker.internal` ensure the application container is running with `docker-compose up --build` from the root folder of the repository.

3. From the `/test/accessibility` directory run `docker-compose run --build --rm wdio-axe`. This will run all accessibility tests.

4. JSON reports will be output as individual page results to `/test/accessibility/json-reports/example-grant`.

5. Any WCAG 2.0/2.1 A/AA violations will fail the tests.
