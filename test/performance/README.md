# Performance Tests
This folder contains the JMeter performance tests for the Grant Eligibility Checker.

## Set up
JMeter must be installed and run locally on the machine in GUI mode to edit tests. See https://jmeter.apache.org/download_jmeter.cgi. To run tests a Docker container is used with JMeter run in command mode.

## Running tests locally
Provide the following environment variables in a .env file using values for your targeted environment:

```
TEST_ENVIRONMENT_PROTOCOL=http
TEST_ENVIRONMENT_HOST=host.docker.internal
TEST_ENVIRONMENT_PORT=3000
```

Then run the following script:
```
./run.sh
```
