# Set base image as Ubuntu:18:04
FROM ubuntu:18.04
RUN apt-get update && apt-get install

# Install NodeJS
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y nodejs build-essential

# Install YarnPKG
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && echo \
"deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install -y yarn

# Install pm2
RUN yarn global add pm2

# Copy over project directory into container
COPY . /fyp
WORKDIR /fyp

# Install client dependencies
WORKDIR client
RUN yarn install

# Install server dependencies
WORKDIR ../server
RUN npm install

# Install oracle dependencies
WORKDIR ../oracles
RUN npm install

# Start all processes via pm2
WORKDIR ../
EXPOSE 8080
EXPOSE 3000

CMD ["pm2", "start"]
