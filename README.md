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

## Setup the client
- [x] Add Vuetify to project & configure it
- [ ] Configure vue-router
	- [ ] Create routes folder with routes.js
	- [ ] Import each route into routes.js
	- [ ] Import routes.js into router.js and set it on the vue-router
- [ ] Create user interfaces w/ Vuetify
	- [ ] Create registration interfaces
		- [x] Create the signup/login slider form
		- [ ] Create profile selection screen
		- [ ] Create buyer dashboard
		- [ ] Create seller dashboard
	- [ ] Create buyer interfaces
	- [ ] Create seller interfaces
	- [ ] Create interfaces involving both
- [ ] Create NodeJS oracles
- [ ] Create NodeJS Smart Contract Event Listener linked to database?

## Setup the server
- [ ] Create the server using express-generator
- [ ] Install initial dependencies?
	- [ ] Middleware such as Joi, Volleyball, Body-Parser etc (Check if already added by express-generator)
	- [ ] Testware such as Mocha/Chai/Supertest
- [ ] Setup API's
	- [ ] Setup authentication API with JWT (Coding Garden Vids)
		- [ ] Setup database
			- [ ] Create document schema's following s1_registration.txt
			- [ ] Obtain connection to MongoDB server in dummy_net
		- [ ] Setup routing
		- [ ] Test routing & database via Mocha/Chai
	- [ ] Setup Property API
		- [ ] Setup database
		- [ ] Setup routing
		- [ ] Test routing & database
	- [ ] Setup Land Registry API
		- [ ] Setup database
		- [ ] Setup routing
		- [ ] Test routing & database
	- [ ] Setup Background Screening API
		- [ ] Setup database
		- [ ] Setup routing
		- [ ] Test routing & database
	- [ ] Setup Session API
		- [ ] Setup database
		- [ ] Setup routing
		- [ ] Test routing & database

## Wire everything together (Client + Server)
- [ ] Link registration interfaces to authentication API
	- [ ] Test registration (register + login)
- [ ] ...

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
