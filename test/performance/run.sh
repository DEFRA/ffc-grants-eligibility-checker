rm -r -f ./html-reports

export TEST_ENVIRONMENT_PROTOCOL=http
export TEST_ENVIRONMENT_HOST=host.docker.internal
export TEST_ENVIRONMENT_PORT=3000

docker-compose run --build --rm perf-test

read -t 3 -p "Exiting..."
