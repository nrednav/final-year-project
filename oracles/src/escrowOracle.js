import axios from 'axios';
import web3 from './web3';
import escrow from './contracts/escrow'
import escrowFactory from './contracts/escrowFactory'

var mongoose = require('mongoose');
var User = require('../db/models/User').User;
var Property = require('../db/models/Property').Property;
var Session = require('../db/models/Session').Session;
var LandRegistry = require('../db/models/LandRegistry').LandRegistry;

class escrowOracle {

	constructor() {
		this.web3 = web3;
		this.contract = escrow;

		this.startListening();
	}

	startListening() {
		console.log("The escrow oracle is now listening for events...");

		this.web3.eth.getAccounts().then(async accounts => {

			// Listen for buyer_deposit_complete event
			this.contract.events.buyer_deposit_complete({
				fromBlock: "latest",
				toBlock: "latest"
			}, async (error, event) => {
				if (error) {
					throw error
				} else {
					console.log('Found event:-\n', event.event);
					console.log(event);

					this.contract.address = event.address;

					let participants = escrowFactory.methods.get_participants().call();
					let sellerAddress = participants[0];
					let buyerAddress = participants[1];

					let updateOptions = {
						$set: {
							'stages.4.mini_stages.1.status': 'ATTR',
							'stages.4.mini_stages.1.buyer_deposit_status': true
						}
					}
					this.updateSession(sellerAddress, buyerAddress, updateOptions);
				}
			});

			// Listen for title_transfer_requested event
			this.contract.events.title_transfer_requested({
				fromBlock: "latest",
				toBlock: "latest"
			}, async (error, event) => {
				if (error) {
					throw error
				} else {
					console.log('Found event:-\n', event.event);
					console.log(event);

					// Get participants
					let participants = escrowFactory.methods.get_participants().call();
					let sellerAddress = participants[0];
					let buyerAddress = participants[1];
					this.transferTitle(sellerAddress, buyerAddress);
				}
			});
		})
		.catch((error) => {
			console.log('Error: could not find any accounts\n' + error);
		});
	}

	transferTitle(sellerAddress, buyerAddress) {
		Session.findOne({
			buyer_address: buyerAddress.toLowerCase(),
			seller_address: sellerAddress.toLowerCase()
		}, (err, session) => {
			if (err) {
				console.log(err);
			} else if (session) {

				// Get property uid
				let oldPropertyUID = this.getPropertyUID(session.property_id);
				let buyerName = this.getBuyerName(session.buyer_id);
				let titleDeedHash = this.getTitleDeedHash(propertyUID);
				let newPropertyUID = this.web3.utils.sha3(buyerName + titleDeedHash);

				// Transfer the title
				var requestUrl = `http://localhost:3000/api/land-registry/update-entry`
				var config = { headers: { Authorization: 'a1b2c3d4e5f6g7' } }
				var body = {
					old_owner_id: session.seller_id,
					old_property_uid: oldPropertyUID,
					new_owner_id: session.buyer_id,
					new_property_uid: newPropertyUID
				}
				axios.put(requestUrl, body, config).then((response) => {
					console.log('Successfully transfered title: \n' + response);
				}).catch((error) => console.log(error));

				let updateOptions = {
					$set: {
						'stages.4.mini_stages.2.status': 'Completed',
						'active_mini_stage': 3,
						'stages.4.mini_stages.3.status': 'In Progress'
					}
				}

				this.updateSession(sellerAddress, buyerAddress, updateOptions);
			} else {
				console.log('could not find any session with that addresses');
			}
		});
	}

	getPropertyUID(propertyID) {
		Property.findOne({
			_id: propertyID
		}, (err, property) => {
			return property.details.property_uid
		});
	}

	getBuyerName(buyerID) {
		User.findOne({
			_id: buyerID
		}, (err, user) => {
			if (err) {
				throw err;
			} else {
				return user.name;
			}
		});
	}

	getTitleDeedHash(propertyUID) {
		LandRegistry.findOne({
			property_uid: propertyUID
		}, (err, entry) => {
			if (err) {
				throw err;
			} else {
				return entry.title_deed_hash;
			}
		});
	}

	updateSession(sellerAddress, buyerAddress, updateOptions) {
		Session.findOne({
			buyer_address: buyerAddress.toLowerCase(),
			seller_address: sellerAddress.toLowerCase()
		}, (err, session) => {
			if (err) {
				console.log(err);
			} else if (session) {
				Session.updateOne({
					_id: session._id
				}, updateOptions, (err) => {
					if (err) {
						throw err;
					} else  {
						console.log(`Successfully updated Session #: ${session._id}`);
					}
				});
			} else {
				console.log('could not find any session with those addresses');
			}
		});
	}
}

const oracle = new escrowOracle();
console.log("Escrow Oracle started...");
