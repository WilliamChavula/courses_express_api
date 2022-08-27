FROM node:18-alpine3.15

LABEL maintainer="William Chavula"
LABEL website="williamchavula.codes"

WORKDIR /express_app

RUN yarn global add nodemon 
COPY package.json .

RUN yarn install
COPY . .

ENTRYPOINT ["yarn", "run", "dev" ]
