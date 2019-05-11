import axios from 'axios';
import web3 from './web3';
import verifier from './contracts/verifier'

var mongoose = require('mongoose');
var User = require('../db/models/User').User;
var Property = require('../db/models/Property').Property;

class VerifierOracle {

	constructor() {
		this.web3 = web3;
		this.contract = verifier;

		this.startListening();
	}

	startListening() {
		console.log("The verifier oracle is now listening for events...");

		this.web3.eth.getAccounts().then(async accounts => {

			// Listen for verification_requested event
			this.contract.events.verification_requested({
				fromBlock: "latest",
				toBlock: "latest"
			}, (error, event) => {
				if (error) {
					//console.log('Error: ' + error);
					throw error
				} else {
					console.log('Found event:-\n', event.event);

					let property_uid = event.returnValues.property_uid;

					var config = {
						headers: {
							Authorization: 'a1b2c3d4e5f6g7'
						},
						params: {
							property_uid: property_uid
						}
					}

					console.log("Requesting information from land registry...");

					axios.get('http://localhost:3000/api/land-registry/get-entry', config)
					.then((res) => {
						console.log("Got information from land registry...");
						console.log("Verifying information received...");
						console.log(res.data.entry);
						this.verifyEntry(res.data.entry);
					})
					.catch((err) => console.log(err));
				}
			});
		})
		.catch((error) => {
			console.log('Error: could not find any accounts\n' + error);
		});
	}

	verifyEntry(entry) {
		if (entry.liens == false) {
			console.log("This property has no liens attached");
			this.sendVerificationResult(entry.property_uid, entry.owner_id, true);
		} else {
			this.sendVerificationResult(entry.property_uid, entry.owner_id, false);
			console.log("This property has liens attached to it");
		}
	}

	sendVerificationResult(property_uid, owner_id, result) {
		// Update property
		Property.updateOne({
			'details.property_uid': property_uid
		},
		{
			$set: {
				verified: 2
			}
		}, (err, result) => {
			if (err) console.log(err);
			console.log(result);
		});

		// Notify the user
		var notification = `Your property with UID: ${property_uid}, is now verified.`;
		User.updateOne({
			_id: owner_id
		}, { $push: { 'profiles.seller.notifications': { message: notification }},
			$inc: { 'profiles.seller.verified_count': 1 }}, (err, result) => {
			if (err) console.log(err);
			console.log('Successfully notified user\n', result);
		});
	}
}

const oracle = new VerifierOracle();
console.log("Oracle started...");
