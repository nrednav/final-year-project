import web3 from './web3';
import fs from 'fs';
import FormData from 'form-data';
import path from 'path';
const axios = require('axios');

const mongoose = require('mongoose');
const grid = require('gridfs-stream');
grid.mongo = mongoose.mongo;

import escrow from './contracts/escrow'
import escrowFactory from './contracts/escrowFactory'

var User = require('../db/models/User').User;
var Property = require('../db/models/Property').Property;
var Session = require('../db/models/Session').Session;
var LandRegistry = require('../db/models/LandRegistry').LandRegistry;

class escrowOracle {

	constructor() {
		this.web3 = web3;
		this.contract = escrow;

		// DB Setup
		const mongo_uri = 'mongodb://localhost:27017/fyp';

		// Create connection
		const conn = mongoose.createConnection(mongo_uri, {
			useNewUrlParser: true
		});

		this.gfs;
		conn.once('open', () => {
			this.gfs = grid(conn.db);
		});

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

					console.log('Getting participants...');
					let participants = await this.contract.methods.get_participants().call();
					let sellerAddress = participants[0];
					let buyerAddress = participants[1];

					console.log('Updating session...');
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

					this.contract.address = event.address;

					// Get participants
					let participants = await this.contract.methods.get_participants().call();
					let sellerAddress = participants[0];
					let buyerAddress = participants[1];
					this.transferTitle(sellerAddress, buyerAddress);
				}
			});

			// Handle title deed commital
			this.contract.events.commit_title_transfer({
				fromBlock: "latest",
				toBlock: "latest"
			}, async (error, event) => {
				if (error) {
					throw error
				} else {
					console.log('Found event:-\n', event.event);
					console.log(event);

					this.contract.address = event.address;

					let participants = await this.contract.methods.get_participants().call();
					let sellerAddress = participants[0];
					let buyerAddress = participants[1];
					this.uploadTitleDeed(sellerAddress, buyerAddress);
				}
			});

			// Handle escrow closing
			this.contract.events.escrow_closed({
				fromBlock: "latest",
				toBlock: "latest",
			}, async (error, event) => {
				if (error) {
					throw error
				} else {
					console.log('Found event:-\n', event.event);
					console.log(event);

					this.contract.address = event.address;

					let participants = await this.contract.methods.get_participants().call();
					let sellerAddress = participants[0];
					let buyerAddress = participants[1];
					this.requestPropertyRemoval(sellerAddress, buyerAddress);
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
				console.log(session);
				console.log('Collecting necessary information for title transfer...');

				// Get old property uid first
				Property.findOne({
					_id: new mongoose.Types.ObjectId(session.property_id)
				}, (err, property) => {
					if (err) {
						throw err;
					} else {
						var oldPropertyUID = property.details.property_uid;

						// Get buyer's name next
						User.findOne({
							_id: new mongoose.Types.ObjectId(session.buyer_id)
						}, (err, user) => {
							if (err) {
								throw err;
							} else {
								var buyerName = user.name;

								// Get title deed hash
								LandRegistry.findOne({
									property_uid: oldPropertyUID
								}, async (err, entry) => {
									if (err) {
										throw err;
									} else {
										var titleDeedHash = entry.title_deed_hash;

										console.log('Generating new property uid...');
										let newPropertyUID = await this.web3.utils.sha3(buyerName + titleDeedHash);
										// Transfer the title
										console.log('Transferring title...');
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

											let updateOptions = {
												$set: {
													'stages.4.mini_stages.2.status': 'Completed',
													'stages.4.active_mini_stage': 3,
													'stages.4.mini_stages.3.status': 'In Progress'
												}
											}
											Session.updateOne({
												_id: session._id
											}, updateOptions, (err, result) => {
												if (err) {
													throw err;
												} else  {
													console.log(result);
													console.log(`Successfully updated Session #: ${session._id}`);
													this.uploadTitleDeedDraft(session._id);
												}
											});
										}).catch((error) => console.log(error));
									}
								});
							}
						});
					}
				});

			} else {
				console.log('could not find any session with that addresses');
			}
		});
	}

	uploadTitleDeed(sellerAddress, buyerAddress) {
		Session.findOne({
			buyer_address: buyerAddress.toLowerCase(),
			seller_address: sellerAddress.toLowerCase()
		}, (err, session) => {
			if (err) {
				throw err;
			} else {
				let requestUrl = `http://localhost:3000/api/sessions/${session._id}/upload-td`
				let config = { headers: { Authorization: 'a1b2c3d4e5f6g7' } }
				axios.post(requestUrl, { upload: true }, config).then((response) => {
					console.log(response);
				}).catch((error) => console.log(error));
			}
		});
	}

	uploadTitleDeedDraft(sessionId) {
		let requestUrl = `http://localhost:3000/api/sessions/${sessionId}/upload-tdd`
		let config = { headers: { Authorization: 'a1b2c3d4e5f6g7' } }
		axios.post(requestUrl, { upload: true } , config).then((response) => {
			console.log(response.data);
			this.respondToTTR(sessionId);
		}).catch((error) => console.log(error));
	}

	/**
	 * @desc - Handles response to a title transfer request
	 */
	async respondToTTR(sessionId) {
		// Get title deed draft document
		let requestUrl = `http://localhost:3000/api/sessions/${sessionId}/title-deed/tdd`
		let config = { headers: { Authorization: 'a1b2c3d4e5f6g7' } }
		axios.get(requestUrl, config).then(async (response) => {

			let titleDraftHash = await this.web3.utils.sha3(response.data);
			let nodeAddress = "0x8a23c7c42333ed6be5a68c24031cd7a737fbcbe8";
			await web3.eth.personal.unlockAccount(nodeAddress, String(1234), 1000);

			let tx = this.contract.methods.title_transfer_response(titleDraftHash).send({
				from: nodeAddress,
				gasPrice: 42000
			}).once('receipt', (receipt) => {
				console.log(receipt);
			}).catch((error) => console.log(error))
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

	requestPropertyRemoval(sellerAddress, buyerAddress) {
		Session.findOne({
			seller_address: sellerAddress.toLowerCase(),
			buyer_address: buyerAddress.toLowerCase()
		}, (err, session) => {
			if (err) {
				throw err
			} else {
				let propertyId = session.property_id;
				let image_ids = []

				// Get image id's
				Property.findOne({
					_id: propertyId
				}, (err, property) => {
					image_ids = property.details.images;

					for (var i in image_ids) {
						this.deletePropertyImage(image_ids[i]);
					}

					this.transferPropertyOwnership(property, session.seller_id, session.buyer_id);
				});
			}
		});
	}

	deletePropertyImage(imageId) {
		this.gfs.remove({
			_id: imageId
		}, (err, gridStore) => {
			if (err) console.log(err);
		});
	}

	// Transfer Property ownership
	transferPropertyOwnership(property, from, to) {
		// Find the seller
		User.updateOne({
			_id: from
		}, {
			$pull: {
				'profiles.seller.properties': property._id
			}
		}, (err, result) => {
			if (err) throw err;
			console.log('Removed property from seller');
			console.log(result);
		});

		// Transfer property to buyer
		User.updateOne({
			_id: to
		}, {
			$push: {
				'profiles.seller.properties': property._id
			}
		}, (err, result) => {
			if (err) throw err;
			console.log('Added property to buyer');
			console.log(result);
		});

		// Update property information
		Property.updateOne({
			_id: property._id
		}, {
			'details.owner': to,
			'verified': 0,
			'listed': false,
			'session_underway': false
		}, (err, result) => {
			if (err) throw err;
			console.log('Updated property information to set buyer as owner');
			console.log(result);
		});
	}
}

const oracle = new escrowOracle();
console.log("Escrow Oracle started...");
