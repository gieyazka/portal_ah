FROM node:18-alpine3.17
ARG SERVERPORT
ENV SERVERPORT "${SERVERPORT}"
WORKDIR /app
RUN apk update && \
    apk add --no-cache tzdata
COPY . .

RUN npm ci
EXPOSE 3000
CMD ["npm", "run", "production"]