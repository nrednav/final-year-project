import axios from 'axios';
import web3 from './web3';
import hd from './contracts/holdingDeposit'
import hdFactory from './contracts/holdingDepositFactory'

var mongoose = require('mongoose');
var User = require('../db/models/User').User;
var Property = require('../db/models/Property').Property;
var Session = require('../db/models/Session').Session;

class HdOracle {

	constructor() {
		this.web3 = web3;
		this.contract = hd;

		this.startListening();
	}

	startListening() {
		console.log("The HD oracle is now listening for events...");

		this.web3.eth.getAccounts().then(async accounts => {

			// Listen for verification_requested event
			this.contract.events.funds_deposited({
				fromBlock: "latest",
				toBlock: "latest"
			}, async (error, event) => {
				if (error) {
					throw error
				} else {
					console.log('Found event:-\n', event.event);
					console.log(event);

					this.contract.address = event.address;

					this.contract.methods.get_participants().call().then((result) => {
						var participants = result;
						var sellerAddress = participants[0].toString();
						var buyerAddress = participants[1].toString();
						console.log(participants);
						this.updateSession(sellerAddress, buyerAddress);
					}).catch((error) => console.log(error));
				}
			});
		})
		.catch((error) => {
			console.log('Error: could not find any accounts\n' + error);
		});
	}

	updateSession(sellerAddress, buyerAddress) {
		console.log(sellerAddress, buyerAddress);
		Session.find({
			buyer_address: buyerAddress.toLowerCase(),
			seller_address: sellerAddress.toLowerCase()
		}, (err, sessions) => {
			if (err) {
				console.log(err);
			} else if (sessions.length > 0) {
				console.log(sessions);
				var session = sessions[0]
				var requestUrl = `http://localhost:3000/api/sessions/${session._id}/update`
				var config = { headers: { Authorization: 'a1b2c3d4e5f6g7' } }
				var body = {
					updateOptions: {
						$set: {
							'stages.1.deposit_status': 'Paid',
							'stages.1.status': 'Completed',
							'progress': 1
						}
					}
				}
				axios.put(requestUrl, body, config).then((response) => {
					console.log(response);
				}).catch((error) => console.log(error));
			} else {
				console.log('could not find any sessions with those addresses');
			}
		});
	}
}

const oracle = new HdOracle();
console.log("Oracle started...");
