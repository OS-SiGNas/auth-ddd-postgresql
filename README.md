### API REST-FULL DDD POO with Nodejs/Typescript and TypeOrm+PostgreSQL

This application is example for DDD, and framework abstraction, you can switch build strateggy like express or fastify, logger winston or console with a environment variable. look #Config.

# dotenv config:

```
.env for producction
.env.dev for development mode
.env.test for testing mode
```

```
# Http
SERVICE_NAME=API-GATEWAY
THIS_URL=http://localhost:4444
HTTP_SERVICE=express
PORT=4444
LOGGER_SERVICE=console

# PostgreSQL
PG_HOST=
PG_PORT=
PG_USERNAME=
PG_PASSWORD=
PG_DATABASE=auth_ddd
PG_RETRY_TIME=1800000

## JWT Secrets

JWT_ACCESS_SECRET_KEY=
JWT_ACCESS_EXPIRED_TIME=3600000

JWT_REFRESH_SECRET_KEY=
JWT_REFRESH_EXPIRED_TIME=86400000

JWT_AA_SECRET_KEY=
JWT_AA_EXPIRED_TIME=1800000

# RabbitMQ
RABBIT_QUEUE=test1
RABBIT_PORT=5672
RABBIT_HOSTNAME=localhost
RABBIT_PROTOCOL=amqp
RABBIT_USERNAME=
RABBIT_PASSWORD=
RABBIT_VHOST=/
RABBIT_AUTH_MECHANISM=PLAIN,AMQPLAIN,EXTERNAL
MQ_TIMEOUT=
MQ_TOPIC_EXAMPLE=
```

### script dev:concurrently is the best option for development mode
