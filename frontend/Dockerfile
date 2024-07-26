FROM node:18-alpine
WORKDIR /msw-frontend/
COPY public/ public
COPY src/ src
COPY package.json package.json
COPY tsconfig.json tsconfig.json

RUN npm i
CMD ["npm", "start"]
