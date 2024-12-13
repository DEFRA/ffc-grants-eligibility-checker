FROM alpine/jmeter

RUN mkdir /html-reports
RUN mkdir /logs
COPY run.sh .
COPY jmeterConfig.csv .
COPY test-plan.jmx .

RUN addgroup -S appgroup
RUN adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup .
RUN chown -R appuser:appgroup /html-reports
RUN chown -R appuser:appgroup /logs
USER appuser

# override base image entrypoint and run custom script
ENTRYPOINT ["/usr/bin/env"]
CMD ["bash", "./run.sh", "-n", "-t", "test-plan.jmx", "-l", "/logs/results.jtl", "-e", "-o", "/html-reports", "-Jjmeter.save.saveservice.assertion_results_failure_message=true"]
