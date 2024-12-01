FROM node:20.7.0-alpine AS builder

RUN apk update && apk upgrade && \
    apk add --no-cache git tzdata ffmpeg wget curl

WORKDIR /app

COPY ./package.json .

RUN npm install

COPY . .

RUN npm run build

FROM node:20.7.0-alpine AS final

ENV TZ=America/Sao_Paulo
ENV DOCKER_ENV=true

ENV SERVER_TYPE=http
ENV SERVER_PORT=8083
ENV SERVER_URL=http://localhost:8083

ENV CORS_ORIGIN=*
ENV CORS_METHODS=POST,GET,PUT,DELETE
ENV CORS_CREDENTIALS=true

ENV LOG_LEVEL=ERROR,WARN,DEBUG,INFO,LOG,VERBOSE,DARK,WEBHOOKS
ENV LOG_COLOR=true
ENV LOG=error

ENV AUTHENTICATION_TYPE=apikey

ENV AUTHENTICATION_API_KEY=B6D711FCDE4D4FD5936544120E713976

ENV AUTHENTICATION_JWT_EXPIRIN_IN=0
ENV AUTHENTICATION_JWT_SECRET='L=0YWt]b2w[WF>#>:&E`'

ENV AUTHENTICATION_INSTANCE_MODE=server

WORKDIR /app

COPY --from=builder /app .

CMD [ "node", "./dist/src/main.js" ]
