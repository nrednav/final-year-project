# Implementation Checklist

## Create FYP directory
- [x] Start markdown checklist
- [x] Initialize the git repo
- [x] Create the top level directories (Client, Servers, Network, Contracts)
  - [x] Use Vue-Create for Client
  - [x] Make blank directories for Servers & Network
  - [x] Create 'Contracts' and then use ``` truffle init ```

## Setup dummy docker network
- [x] Add private ethereum network
  - [x] Copy over "dummy_net" under the network dir
- [x] Add MongoDB service to the docker-compose file

## Setup smart contracts
- [x] Configure truffle to deploy to the dummy test network
- [x] Write the smart contracts and put them under 'Contracts/contracts'
	- [x] Holding deposit contract
	- [x] Property Verification contract
	- [x] Escrow contract
- [x] Test compilation + migration using truffle
- [x] Write Mocha tests for each smart contract
  - [x] Property Verification contract
  - [x] Holding Deposit contract
  - [x] Escrow contract

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
