import axios from 'axios';
import web3 from './web3';
import hd from './contracts/holdingDeposit'
import hdFactory from './contracts/holdingDepositFactory'
import escrow from './contracts/escrow'
import escrowFactory from './contracts/escrowFactory'

var mongoose = require('mongoose');
var User = require('../db/models/User').User;
var Property = require('../db/models/Property').Property;
var Session = require('../db/models/Session').Session;

class HdOracle {

	constructor() {
		this.web3 = web3;
		this.contract = hd;
		this.escrow_contract = escrow;

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

			// Listen release holding deposit event
			this.escrow_contract.events.release_holding_deposit({
				fromBlock: 0,
				toBlock: "latest"
			}, async (error, event) => {
				if (error) {
					throw error
				} else {
					console.log('Found event:-\n', event.event);
					console.log(event);

					this.escrow_contract.address = event.address;

					// Get participants
					let participants = await this.escrow_contract.methods.get_participants().call();
					let sellerAddress = participants[0];
					let buyerAddress = participants[1];
					this.releaseHoldingDeposit(sellerAddress, buyerAddress);
				}
			});
		})
		.catch((error) => {
			console.log('Error: could not find any accounts\n' + error);
		});
	}

	updateSession(sellerAddress, buyerAddress) {
		Session.findOne({
			buyer_address: buyerAddress.toLowerCase(),
			seller_address: sellerAddress.toLowerCase()
		}, (err, session) => {
			if (err) {
				console.log(err);
			} else if (session) {
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
				console.log('could not find any session with that addresses');
			}
		});
	}

	releaseHoldingDeposit(sellerAddress, buyerAddress) {
		Session.findOne({
			seller_address: sellerAddress.toLowerCase(),
			buyer_address: buyerAddress.toLowerCase()
		}, async (err, session) => {
			if (err) throw err;

			console.log('Getting hd contract address from session...');
			let hdContract = hd;
			hdContract.address = session.stages['1'].holding_deposit_address

			console.log('Configuring node address...');
			let nodeAddress = "0x8a23c7c42333ed6be5a68c24031cd7a737fbcbe8";
			await web3.eth.personal.unlockAccount(nodeAddress, String(1234), 1000);

			console.log('Releasing deposit...');
			let tx = hdContract.methods.release_deposit().send({
				from: nodeAddress,
				gasPrice: 42000
			}).once('receipt', (receipt) => {
				console.log(receipt);
			}).catch((error) => console.log(error))
		});
	}
}

const oracle = new HdOracle();
console.log("Oracle started...");
