# Traces exercise

## How to run the project:

To run this project need Docker to install because needs Redis and MongoDb. For this proposal was adding the docker-compose.yaml to launch all the platforms needed.

And `docker-compose up` to launch the project, then can use any browser o Api Client to test the different endpoint. If the port selected on en .env, this is the port used for the service

## Env 
Also need to add .env, there are an .example.env to see the different parameters needed.
```js
    PORT=3000
    NODE_ENV="development"
    HOST="localhost"

    MONGO_HOST=""
    MONGO_PORT=
    MONGO_URL = "mongodb://${MONGO_HOST}:${MONGO_PORT}/trace"

    REDIS_HOST=""
    REDIS_PORT=
    REDIS_URL="redis://${REDIS_HOST}:${REDIS_PORT}"

    IP_API_HOST="http://ip-api.com"

    API_LAYER_HOST="https://api.apilayer.com/fixer/convert"
    API_LAYER_API_TOKEN=
```
For the Api layer need to generate the token on https://apilayer.com

## Enabled endpoints

1. *GET*    /statistics
2. *POST*   /traces

To see more information about the endpoint, you can access `localhost:PORT/doc`

## How to run the test

There are two ways to run tests, one is running `runtests.sh` or `make test`

## Example endpoint

There is an endpoint ready to use on https://traces-exercise-production.up.railway.app/
