FROM alpine/jmeter

COPY test-plan.jmx .
RUN mkdir /logs
RUN mkdir /html-reports

RUN addgroup -S appgroup
RUN adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup .
RUN chown -R appuser:appgroup /logs
RUN chown -R appuser:appgroup /html-reports
USER appuser

CMD ["-n -t test-plan.jmx -l /logs/log.csv -e -o /html-reports"]
