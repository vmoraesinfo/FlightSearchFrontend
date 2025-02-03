FROM node:18-alpine
WORKDIR /usr/flight-serach-frontend
COPY package.json /usr/flight-serach-frontend/package.json
COPY package-lock.json /usr/flight-serach-frontend/package-lock.json

RUN npm install
COPY . /usr/flight-serach-frontend
EXPOSE 80
CMD [ "npm", "run", "dev" ]