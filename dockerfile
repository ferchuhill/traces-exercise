FROM node:16


# Create app directory
WORKDIR /usr/src/app

# RUN npm install -g npm

# Install app dependenciesd
COPY package*.json ./

RUN npm install

EXPOSE ${PORT}

CMD ["sh", "-c", "npm run dev"]