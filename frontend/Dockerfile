FROM node:18-alpine
WORKDIR /msw-frontend/
COPY public/ public
COPY src/ src
COPY package.json package.json
COPY .env.local .env.local
COPY tsconfig.json tsconfig.json

RUN npm i
CMD ["npm", "start"]
