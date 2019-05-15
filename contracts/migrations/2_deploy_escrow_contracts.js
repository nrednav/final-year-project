const fs = require("fs");

const Escrow = artifacts.require("Escrow");
const EscrowFactory = artifacts.require("EscrowFactory");

module.exports = function(deployer) {
	deployer.deploy(EscrowFactory)
	.then(() => {
		// Write contract address to file
		var myconfig = JSON.parse(fs.readFileSync("../myconfig.json"));
		myconfig.addresses.escrow_factory = EscrowFactory.address;
		myconfig.abi.escrow_factory = EscrowFactory.abi;

		fs.writeFile("../myconfig.json", JSON.stringify(myconfig, null, 4), (err) => {
			if (err) console.error(err);
			console.log("Wrote contract address to file");
		});
	});
}
