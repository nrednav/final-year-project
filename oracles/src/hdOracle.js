import axios from 'axios';
import web3 from './web3';
import hd from './contracts/holdingDeposit'

var mongoose = require('mongoose');
var User = require('../db/models/User').User;
var Property = require('../db/models/Property').Property;
var Session = require('../db/models/Session').Session;

class HdOracle {

	constructor() {
		this.web3 = web3;
		this.contract = hd;
		this.contract.address = '0x924ad28B07db87ADbCC7356c9171cF8fe44B4F3F'

		this.startListening();
	}

	startListening() {
		console.log("The HD oracle is now listening for events...");

		this.web3.eth.getAccounts().then(async accounts => {

			// Listen for verification_requested event
			this.contract.events.funds_deposited({
				fromBlock: 0,
				toBlock: "latest"
			}, async (error, event) => {
				if (error) {
					//console.log('Error: ' + error);
					throw error
				} else {
					// console.log('Found event:-\n', event);

					let participants = await this.contract.methods.get_participants().call()
					console.log(participants)
				}
			});
		})
		.catch((error) => {
			console.log('Error: could not find any accounts\n' + error);
		});
	}

const oracle = new HdOracle();
console.log("Oracle started...");
