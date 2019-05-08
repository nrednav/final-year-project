import axios from 'axios';
import web3 from './web3';
import verifier from './contracts/verifier'

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
				fromBlock: 0,
				toBlock: "latest"
			}, (error, event) => {
				if (error) console.log('Error: ' + error);

				console.log('Found event:-');
				console.log(event);

				let returnValues = event.returnValues;
				let title_deed_hash = returnValues.title_deed_hash;
				let owner_fname = returnValues.owner_forename;
				let owner_lname = returnValues.owner_surname;
				let owner_name = owner_fname + ' ' + owner_lname;

				var config = {
					headers: {
						Authorization: 'a1b2c3d4e5f6g7'
					},
					params: {
						owner_name: owner_name,
						title_deed_hash: title_deed_hash
					}
				}

				console.log("Requesting information from land registry...");
				axios.get('http://localhost:3000/api/land-registry/get-entry', config)
				.then((res) => {
					console.log("Got information from land registry...");
					console.log("Verifying information received...");
					this.verifyEntry(res.data.entry);
				})
				.catch((err) => console.log(err));
			});
		});
	}

	verifyEntry(entry) {
		if (entry.liens == false) {
			console.log("This property has no liens attached");
			this.sendVerificationResult(entry.title_deed_hash, true);
		} else {
			this.sendVerificationResult(entry.title_deed_hash, false);
			console.log("This property has liens attached to it");
		}
	}

	sendVerificationResult(title_deed_hash, result) {
		console.log("Sending verification result to smart contract...");
		this.web3.eth.getAccounts().then(async accounts => {
			console.log(accounts);
			this.contract.methods.verified(title_deed_hash, result).send({
				from: accounts[0]
			}).then((tx_receipt) => {
				console.log("... Verification sent");
				console.log("TX Receipt: " + tx_receipt);
			});
		});
	}
}

const oracle = new VerifierOracle();
console.log("Oracle started...");
