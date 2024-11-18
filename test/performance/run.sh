rm -r -f ./html-reports
docker-compose run --build --rm perf-test
read -t 3 -p "Exiting..."
