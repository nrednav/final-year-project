const HoldingDeposit = artifacts.require("HoldingDeposit");
const HoldingDepositFactory = artifacts.require("HoldingDepositFactory");

module.exports = function(deployer) {
	deployer.deploy(HoldingDepositFactory);
}
