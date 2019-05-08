import axios from 'axios';
import web3 from './web3';
import verifier from './contracts/verifier'

class Client {

	constructor() {
		this.web3 = web3;
		this.contract = verifier;

		this.startListening();
	}

	startListening() {
		console.log("The client is now listening for events...");

		this.web3.eth.getAccounts().then(async accounts => {

			// Listen for verification_requested event
			this.contract.events.verification_completed({
				fromBlock: 0,
				toBlock: "latest"
			}, (error, event) => {
				if (error) console.log('Error: ' + error);

				console.log('Found event:-');
				console.log(event);

				let returnValues = event.returnValues;
				console.log(returnValues);
			});
		});
	}
}

const client = new Client();
console.log("Oracle started...");
