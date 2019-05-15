# Implementation Checklist

## Backlog
- [ ] Finish escrow stage interface + backend
- [ ] Try putting entire project into docker, via dockerfile (so as to manage dependencies)

## Stuff to do at end
- [ ] Display offers to buyer
	- [ ] Offer status, property id, timestamp
- [ ] Fix add property preview image from going over the date picker
- [ ] Prevent users from accessing other users property information
- [ ] Prevent sellers from making offers on their own property
	- [ ] Filter the search results
- [ ] Prevent sellers from making multiple offers against the same property
	- [ ] Filter the search results
- [ ] Import mapGetters / axios globally?
- [ ] Figure out how to display gridfs images on view property component

---

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
- [x] Configure vue-router
	- [x] Create routes folder with routes.js
	- [x] Import routes.js into router.js and set it on the vue-router
- [ ] Create user interfaces w/ Vuetify
	- [x] Create registration interfaces
		- [x] Create the signup/login slider form
			- [x] Add client-side validation manually
			- [x] Prevent user from registering or logging in unless metamask is enabled
		- [x] Create profile selection screen
		- [x] Create buyer dashboard
		- [x] Create seller dashboard
		- [x] Add validation
	- [x] Create buyer interfaces
		- [x] SearchResults (copy of seller's property list)
	- [x] Create seller interfaces
		- [x] Add offer panel under 'view property' panel
	- [ ] Create interfaces involving both
		- [ ] Offers (carbon copy of notifications)
			* Static information on cards, no click to view more functionality
		- [ ] Escrow
		- [ ] Notifications (mini copy of sellers prop list)
		- [x] Holding Deposit
		- [x]	Background Screening
		- [x] SessionList (copy of seller's property list)
		- [x] ViewSession
- [ ] Create NodeJS oracles
	- [x] Create verifier oracle
	- [x] Create hd oracle
	- [ ] Create escrow oracle

## Setup the server
- [x] Create the server using express-generator
- [x] Install initial dependencies?
	- [x] Middleware such as Joi, Volleyball, Body-Parser etc (Check if already added by express-generator)
	- [ ] Testware such as Mocha/Chai/Supertest
- [x] Setup API's
	- [x] Setup authentication API with JWT (Coding Garden Vids)
		- [x] Setup database
			- [x] Create document schema's following s1_registration.txt
			- [x] Obtain connection to MongoDB server in dummy_net
		- [x] Setup routing
	- [x] Setup Property API (Create, Read, Delete)
		- [x] Setup database
		- [x] Setup routing
	- [x] Setup Land Registry API (Create, Read)
		- [x] Setup database
		- [x] Setup routing
	- [x] Setup Background Screening API (Create, Read)
		- [x] Setup database
		- [x] Setup routing
	- [x] Setup Session API (Create, Read, Update, Delete)
		- [x] Setup database
		- [x] Setup routing
- [ ] Test API's routing & database with Mocha/Chai/Supertest?

## Wire everything together (Client + Server)
- [x] Link registration interfaces to authentication API
	- [x] Test registration (register + login)
- [ ] ...

## Setup the main docker network
- [ ] Add private blockchain network
- [ ] Add mongodb server

## Test the entire platform
- [ ] Open two clients on different ports

## Final work
- [ ] Create project makefile/script
	- [ ] Start/Stop/Restart network
	- [ ] Use truffle to deploy contracts
	- [ ] Open 3 additional sessions
		- [ ] Start oracles
		- [ ] Start client
		- [ ] Start server
- [ ] Create instruction files
  - [ ] File containing all the versions of tools/software used
  - [ ] File containing instructions on how to setup the project
- [ ] Create "list_of_ports.txt" file to keep track of all ports actively used in the project
