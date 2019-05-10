const fs = require("fs");

const HoldingDeposit = artifacts.require("HoldingDeposit");
const HoldingDepositFactory = artifacts.require("HoldingDepositFactory");

module.exports = function(deployer) {
	deployer.deploy(HoldingDepositFactory).then(() => {
		var myconfig = JSON.parse(fs.readFileSync("../myconfig.json"));
		myconfig.addresses.holding_deposit_factory = HoldingDepositFactory.address;
		myconfig.abi.holding_deposit_factory = HoldingDepositFactory.abi;

		fs.writeFile("../myconfig.json", JSON.stringify(myconfig, null, 4), (err) => {
			if (err) console.error(err);
			console.log("Wrote contract address to file");
		});
	});
}
