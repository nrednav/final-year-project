# Implementation Checklist

## Create FYP directory
- [x] Start markdown checklist
- [x] Initialize the git repo
- [ ] Create the top level directories (Client, Servers, Network, Contracts)
  - [ ] Use Vue-Create for Client
  - [ ] Make blank directories for Servers & Network
  - [ ] Create 'Contracts' and then use ``` truffle init ```

## Setup dummy docker network
- [ ] Add private ethereum network
  - [ ] Copy over "dummy_net" under the network dir
- [ ] Add MongoDB service to the docker-compose file

## Setup smart contracts
- [ ] Configure truffle to deploy to the dummy test network
- [ ] Write the smart contracts and put them under 'Contracts/contracts'
- [ ] Handle compilation + migration using truffle
- [ ] Write Mocha tests for each smart contract
  - [ ] Property Verification contract
  - [ ] Holding Deposit contract
  - [ ] Escrow contract
  
## Create all user interfaces
...

## Setup the servers
...

## Wire everything together (Client + Server)
...

## Setup the main docker network
- [ ] Add private blockchain network
- [ ] Add ipfs node
- [ ] Add mongodb server

## Test the entire platform
- [ ] Open two clients on different ports

## Final work
- [ ] Create instruction files
  - [ ] File containing all the versions of tools/software used
  - [ ] File containing instructions on how to setup the project
- [ ] Create "list_of_ports.txt" file to keep track of all ports actively used in the project
