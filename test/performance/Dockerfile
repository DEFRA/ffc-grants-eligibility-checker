FROM alpine/jmeter

RUN mkdir /html-reports
COPY jmeterConfig.csv .
COPY run.sh .
COPY test-plan.jmx .

RUN addgroup -S appgroup
RUN adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup .
RUN chown -R appuser:appgroup /html-reports
USER appuser

# override base image entrypoint and run custom script
ENTRYPOINT ["/usr/bin/env"]
CMD ["bash", "./run.sh"]
