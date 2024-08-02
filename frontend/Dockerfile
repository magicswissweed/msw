FROM node:18-alpine
WORKDIR /msw-frontend/
COPY public/ public
COPY src/ src
COPY package.json package.json
COPY tsconfig.json tsconfig.json

# replace localhost:8080 with prod-url
RUN sed -i 's/localhost:8080/34.154.151.158:8080/g' src/gen/msw-api-ts/base.ts

RUN npm i
CMD ["npm", "start"]
