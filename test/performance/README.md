# Performance Tests
This directory contains the JMeter performance test for the FFC Grant Eligibility Checker. The test is designed to run over a 30 second period in the Jenkins pipeline to catch any regression in performance that is introduced. The test will fail the Jenkins stage if:

- The rolling average response time exceeds 1 second.
- Any individual response time exceeds 5 seconds.
- Any individual request returns a non-200 response status.

## Editing the JMeter test plan
To edit the test plan, ideally JMeter should be installed and run locally on your machine in GUI mode. See https://jmeter.apache.org/download_jmeter.cgi. Small changes can be made by hand to the XML file.

## Running locally
To run the test a Docker container is used with JMeter executed in command mode. You must provide the protocol, host and port to be used in file `jmeterConfig.csv` in the following format:

```
http;host.docker.internal;3000
```

This file is overwritten by Jenkins with the PR-specific details when the pipeline runs. The following command can then be used to run the test in the same manner as Jenkins. In directory `/test/performance` run:

```
docker-compose -f ../../docker-compose.yaml -f docker-compose.jmeter.yaml run --build --rm jmeter-test
```

## Reports
The results CSV and HTML report are written to `/test/performance/html_reports`. Any failures will fail the Jenkins pipeline stage.
