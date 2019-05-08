#!/bin/bash

# Turn off the network and remove volumes
echo "Turning off network..."
cd ./network/dummy_net
docker-compose down -v

# Start the network
echo "Starting the network..."
docker-compose up -d

# Go home
cd ../../

# Go to contracts and migrate them
echo "Compiling and migrating the contracts..."
cd ./contracts
truffle migrate --network development --reset

cd ../../
echo "Finished..."
