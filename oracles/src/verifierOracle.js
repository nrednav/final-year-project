import axios from 'axios';
import web3 from './web3';
import verifier from './contracts/verifier'

class VerifierOracle {

	constructor() {
		this.web3 = web3;
		this.contract = verifier;

		console.log(this.contract);

		this.startListening();
	}

	async verifyProperty(title_deed_hash, owner_name) {
		console.log('Sending request...');

		let body = {
			"owner_name": owner_name
		}

		const result = await axios.get('http://localhost:3000/api/land-registry/get-entry',
			body,
			{
				headers:
				{
					Authorization: 'a1b2c3d4e5f6g7'
				}
			}, (err, entries) => {
				if (err) console.log(err);
				 // console.log(entries);
			});

		// this.sendVerificationResult();
	}

	async sendVerificationResult() {
		console.log('hello');
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

				console.log(owner_name);

				this.verifyProperty(title_deed_hash, owner_name);
			});
		});
	}
}

const oracle = new VerifierOracle();
console.log("Oracle started...");
