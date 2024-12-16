# Accessibility Tests
This folder contains the accessibility test for the FFC Grant Eligibility Checker. The framework used is WebdriverIO with Axe and the test is containerised, running against a single browser (Chrome). The expected Defra pattern is to use axe-core/cli but this does not support navigating through pages to move through the eligibility checker journey.

## docker-compose
The docker-compose file used is at the root of the repository, `docker-compose-axe.yaml`. This file is detected and executed by the Jenkins pipeline. The host base URL is defined in this file.

## Running locally
Docker is used to create containers for both the test and the Selenium instance of Chrome.

For ARM architectures, change the image used for Chrome in `docker-compose-axe.yaml`:

```dockerfile
  selenium-axe:
    image: selenium/standalone-chrome

# CHANGES TO..

  selenium-axe:
    image: seleniarm/standalone-chromium
```   

From the root of the repository use the following command to run the accessibility test in the same manner as the Jenkins pipeline:

```
docker-compose -f docker-compose.yaml -f docker-compose.axe.yaml run --build --rm axe
```

## Reports

JSON reports will be output as individual page results to `/test-output/axe-reports/example-grant`. Any WCAG 2.0/2.1 A/AA violations will fail the tests.
