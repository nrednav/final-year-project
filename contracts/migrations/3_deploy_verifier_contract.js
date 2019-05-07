const fs = require("fs");

const Verifier = artifacts.require('Verifier');

module.exports = function(deployer) {
	deployer.deploy(Verifier).then(() => {
		var myconfig = JSON.parse(fs.readFileSync("../myconfig.json"));
		myconfig.addresses.verifier_oracle = Verifier.address;
		myconfig.abi.verifier_oracle = Verifier.abi;

		fs.writeFile("../myconfig.json", JSON.stringify(myconfig, null, 4), (err) => {
			if (err) console.error(err);
			console.log("Wrote contract address to file");
		});
	});
}
