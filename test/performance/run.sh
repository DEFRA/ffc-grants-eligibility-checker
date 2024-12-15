#!/bin/bash

# clear down any local output after volumes mounted
rm -r -f /html-reports/*

# call base image entrypoint with jmeter parameters
bash /entrypoint.sh -n -t test-plan.jmx -l /html-reports/results.csv -e -o /html-reports -Jjmeter.save.saveservice.assertion_results_failure_message=true

# exit non-zero if failures occurred
if grep -q ',false,' /html-reports/results.csv; then
    echo "RESULTS CONTAIN FAILURES, EXITING NON-ZERO"
    exit 1
fi
