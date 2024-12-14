#!/bin/bash
# script is an adaptation of the below entrypoint of the base image, with return code added
# https://github.com/alpine-docker/jmeter/blob/master/entrypoint.sh

# clear down old output after volumes mounted
rm -r -f /html-reports/*

# set up JVM
set -e
freeMem=`awk '/MemFree/ { print int($2/1024) }' /proc/meminfo`
s=$(($freeMem/10*8))
x=$(($freeMem/10*8))
n=$(($freeMem/10*2))
export JVM_ARGS="-Xmn${n}m -Xms${s}m -Xmx${x}m"

# execute jmeter with passed args
jmeter $@

# exit non-zero if failures occurred
if grep -q ',false,' /html-reports/results.csv; then
    echo "FAILURES FOUND IN RESULTS"
    exit 1
fi
