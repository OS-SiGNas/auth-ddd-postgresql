### API REST-FULL DDD POO with Nodejs/Typescript and TypeOrm+PostgreSQL

This application is example for DDD, and framework abstraction, you can switch build strateggy like express or fastify, logger winston or console with a environment variable. look #Domain/config.ts.

# dotenv config:

```
.env for producction
.env.dev for development mode
.env.test for testing mode
```

```
# Http

HTTP_SERVICE=fastify
PORT=4444
THIS_URL=http://localhost:4444
LOGGER_SERVICE=console

# PostgreSQL

PG_HOST=
PG_PORT=
PG_USERNAME=
PG_PASSWORD=
PG_DATABASE=
PG_RETRY_TIME=1800000

# ACCESS TOKEN

JWT_ACCESS_SECRET_KEY=
JWT_ACCESS_EXPIRED_TIME=1h

# REFRESH TOKEN

JWT_REFRESH_SECRET_KEY=
JWT_REFRESH_EXPIRED_TIME=24h

# ACCTIVATE ACCOUNT TOKEN

JWT_AA_SECRET_KEY=
JWT_AA_EXPIRED_TIME=15m
```

### script dev:concurrently is the best option for development mode
