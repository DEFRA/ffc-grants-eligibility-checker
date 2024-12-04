# Accessibility Tests
This folder contains the accessibility tests for the Grants Eligibility Checker web app. The framework used is WebdriverIO with Axe and the tests are containerised, running against a single browser (Chrome). The Defra pattern is to use axe-core/cli, but this does not support navigating through pages to move through the eligibility checker journey.
.
## Requirements
- Docker
- Node
- npm

## docker-compose file
The docker-compose file used is at the root of the repository, `docker-compose-axe.yaml`. This file is detected and executed by the Jenkins pipeline. The host base URL is defined in this file.

## Running tests
Docker is used to create containers for both the tests and the Selenium instance of Chrome.

For ARM architectures, change the image used for Chrome in `docker-compose-axe.yaml`:

```dockerfile
  selenium-axe:
    image: selenium/standalone-chrome

# CHANGES TO..

  selenium-axe:
    image: seleniarm/standalone-chromium
```   

From the root of the repository directory run `docker-compose -f docker-compose.yaml -f docker-compose.axe.yaml run axe`. This will run all accessibility tests in the same manner as the Jenkins pipeline.

docker-compose run --build --rm wdio-cucumber

JSON reports will be output as individual page results to `/test-output/axe-reports/example-grant`.

Any WCAG 2.0/2.1 A/AA violations will fail the tests.
