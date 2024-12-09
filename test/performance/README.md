# Performance Tests
This folder contains the JMeter performance test for the Grant Eligibility Checker. The test is designed to run over a 60 second period in the Jenkins pipeline to catch any regression in performance that is introduced.

## Editing the JMeter test plan
To edit the test plan, ideally JMeter should be installed and run locally on your machine in GUI mode. See https://jmeter.apache.org/download_jmeter.cgi. Small changes can be made by hand to the XML file.

## Running tests locally in Docker
To run tests a Docker container is used with JMeter executed in command mode. You must provide the scheme, host and port to be used in file `jmeterConfig.csv` in the following format:

```
http;host.docker.internal;3000
```

The following script can then be used to run the test with the same command as the Jenkins pipeline, clearing the reports directory first as required by JMeter:

```
./run.sh
```
