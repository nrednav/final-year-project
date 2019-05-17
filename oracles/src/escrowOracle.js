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

			//	var oldPropertyUID;
			//	var buyerName;
			//	var titleDeedHash;

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
													'active_mini_stage': 3,
													'stages.4.mini_stages.3.status': 'In Progress'
												}
											}
											this.updateSession(sellerAddress, buyerAddress, updateOptions);
											this.uploadTitleDeedDraft(session._id);
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

				fs.writeFile('./titleDeed.txt', 'Title Deed', (err) => {
					if (err) {
						throw err;
					} else {
						console.log('Created title deed');
						const titleDeed = fs.readFileSync(path.resolve(__dirname,
							'./titleDeed.txt'));

						// Make request to session server router to upload file
						let requestUrl = `http://localhost:3000/api/sessions/${sessionId}/upload-td`
						let config = { headers: { Authorization: 'a1b2c3d4e5f6g7' } }

						let formData = new FormData();
						formData.append('file', titleDeed);

						axios.post(requestUrl, formData, config).then((response) => {
							console.log(response);
						}).catch((error) => console.log(error));
					}
				});
			}
		});
	}

	uploadTitleDeedDraft(sessionId) {
		/*
		 * Use this link to find out how: https://github.com/zishon89us/node-cheat/blob/master/gridfs/direct_upload_gridfs/app.js
		 * Also this one maybe: https://stackoverflow.com/questions/31252063/using-mongodb-express-node-js-and-gridfs-stream-for-storing-video-and-picture
		 *
		 * CREATE THE HANDLER IN THE SESSION ROUTER
		 * AND THEN TEST IT USING THE NODE CONSOLE &
		 * ALSO TEST IT USING POSTMAN
		 */
		fs.writeFile(path.join(__dirname, '/titleDeedDraft.txt'), 'Title Deed Draft', (err) => {
			if (err) {
				throw err;
			} else {
				console.log('Created title deed draft');
				const titleDeedDraft = fs.readFileSync(path.join(__dirname,
					'/titleDeedDraft.txt'));

				// Make request to session server router to upload file
				let requestUrl = `http://localhost:3000/api/sessions/${sessionId}/upload-tdd`
				let config = { headers: { Authorization: 'a1b2c3d4e5f6g7' } }

				let formData = new FormData();
				formData.append('file', titleDeedDraft);

				axios.post(requestUrl, formData, config).then((response) => {
					console.log(response);
					this.respondToTTR(titleDeedDraft);
				}).catch((error) => console.log(error));
			}
		});
	}

	async respondToTTR(file) {
		let titleDraftHash = await this.web3.utils.sha3(file);
		let nodeAddress = "0x8a23c7c42333ed6be5a68c24031cd7a737fbcbe8";
		await web3.eth.personal.unlockAccount(nodeAddress, String(1234), 1000);

		let tx = this.contract.methods.title_transfer_response(titleDraftHash).send({
			from: nodeAddress,
			gasPrice: 42000
		}).once('receipt', (receipt) => {
			console.log(receipt);
		}).catch((error) => console.log(error))
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
			seller_address: sellerAddress,
			buyer_address: buyerAddress
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

	// Delete property by id
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
