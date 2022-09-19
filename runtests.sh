#!/bin/sh

# this script is use to launch the docker-compose and run the tests
# it is used by the CI\CD pipeline

# launch the docker-compose
docker-compose -f docker-test.yml up -d

# wait for the docker to be ready
echo "Wait for the docker to be ready"
while ! curl http://localhost:9000/healthcheck; do
    sleep 1;
done;
echo "Docker is up and running"

# run the tests
docker exec app_test npm test


# stop the docker-compose
echo "$(date) - Stoping the container"
docker-compose down