FROM node:18-alpine
WORKDIR /msw-frontend/
COPY public/ public
COPY src/ src
COPY package.json package.json
COPY tsconfig.json tsconfig.json

EXPOSE 3000

# replace localhost:8080 with prod-url
RUN sed -i 's|http://localhost:8080|https://api.msw.ponteshare.ch/api/v1|g' src/gen/msw-api-ts/base.ts

RUN npm i
CMD ["npm", "start"]