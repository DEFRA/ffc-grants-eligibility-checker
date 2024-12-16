FROM alpine/jmeter

RUN mkdir /html-reports
RUN mkdir /logs
COPY jmeterConfig.csv .
COPY run.sh .
COPY test-plan.jmx .

RUN addgroup -S appgroup
RUN adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup .
RUN chown -R appuser:appgroup /html-reports
RUN chown -R appuser:appgroup /logs
USER appuser

# override base image entrypoint and run custom script
ENTRYPOINT ["/usr/bin/env"]
CMD ["bash", "./run.sh"]
