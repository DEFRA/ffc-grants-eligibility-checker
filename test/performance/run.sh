rm -r -f ./html-reports
docker-compose -f ../../docker-compose.yaml -f docker-compose.jmeter.yaml run --build --rm jmeter-test
read -t 3 -p "Exiting..."
