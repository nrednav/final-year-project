const HoldingDeposit = artifacts.require("HoldingDeposit");
const HoldingDepositFactory = artifacts.require("HoldingDepositFactory");

contract("HoldingDepositFactory", accounts => {

	let hd_factory;
	let hd;
	let hd_address;

	beforeEach(async () => {
		hd_factory = await HoldingDepositFactory.new();

		let session_id_hash = "0xdc345837d24517858368a28c2022936404ae5a64e78dcac16331108d53eeca9c";
		let result = await hd_factory.open_holding_deposit(session_id_hash);

		hd_address = result.logs[0].args.holding_deposit_contract;
		hd = await HoldingDeposit.at(hd_address);
	});

	describe("Holding Deposit Factory", () => {

		it("deploys a holding deposit contract", async () => {
			assert.ok(hd_factory.contract.options.address);
			assert.ok(hd.contract.options.address);
		});

		it('emits an event when the holding contract is deployed', () => {
			hd_factory.getPastEvents('holding_deposit_created', (err, events) => {
				assert.notEqual(0, events.length, "No holding_deposit_created events were found");
			});
		});

		it('sets the caller of open_holding deposit to be the seller on the holding contract', async () => {
			let participants = await hd.get_participants();
			assert.equal(participants[0], accounts[0], "The seller was not properly set");
		});

		it('creates a mapping entry for the newly created holding contract under a session id',
			async () => {
			let session_id_hash = "0xdc345837d24517858368a28c2022936404ae5a64e78dcac16331108d53eeca9c";
			let result = await hd_factory.get_holding_deposit_contract(session_id_hash);
			assert.equal(result, hd.contract.options.address);
		});
	});


	describe("Holding Deposit", () => {

		describe("Constructor", () => {
			it("Sets the seller, status and opens the holding", async () => {
				let participants = await hd.get_participants();
				let seller = participants[0];
				assert.equal(seller, accounts[0]);

				let seller_status = await hd.get_seller_status();
				assert.equal(seller_status, true);

				let open = await hd.is_open();
				assert.equal(open, true);
			});
		});

		describe("Depositing Funds", () => {
			it("sets up the buyer, their deposit and status in the holding contract",
				async () => {

				let tx = await hd.deposit_funds({
					from: accounts[1],
					value: web3.utils.toWei('1', 'ether')
				});

				let participants = await hd.get_participants();
				assert.equal(participants[1], accounts[1]);

				let buyer_status = await hd.get_buyer_status();
				assert.equal(buyer_status, true);

				let deposit = await hd.get_deposit_amount();
				assert.equal(Number(deposit), Number(web3.utils.toWei('1', 'ether')));
			});

			it("prevents the seller from depositing into their own holding", async () => {
				try {
					await hd.deposit_funds({
						from: accounts[0],
						value: 10
					});
				}
				catch (err) {
					assert.include(err.message, "revert");
				}
			});

			it("emits an event when the deposit is complete", async () => {
				let tx = await hd.deposit_funds({
					from: accounts[1],
					value: 10
				});
				assert.equal("funds_deposited", tx.logs[0].event);
			});
		});


		describe("Updating status", () => {

			it("lets the buyer update their status, refunding them the deposit", async () => {
				let tx = await hd.deposit_funds({
					from: accounts[1],
					value: web3.utils.toWei('5', 'ether')
				});

				let pre_balance = Number(await web3.eth.getBalance(accounts[1]));

				let tx2 = await hd.update_status(false, {
					from: accounts[1]
				});

				let post_balance = Number(await web3.eth.getBalance(accounts[1]));

				let deposit = Number(await hd.get_deposit_amount());
				assert.equal(deposit, 0);
				assert.isAbove(post_balance, pre_balance);
			});

			it("emits an event when the status is updated", async () => {
				let tx = await hd.update_status(false, {
					from: accounts[0]
				});

				assert.equal("status_updated", tx.logs[0].event);
			});
		});


		describe("Handles a Complete Holding Deposit from start to finish", () => {
			it("forfeits deposit", async () => {
				// Buyer deposits funds
				let tx1 = await hd.deposit_funds({
					from: accounts[1],
					value: web3.utils.toWei('5', 'ether')
				});

				let deposit_refundable_1 = await hd.is_refundable();
				assert.equal(true, deposit_refundable_1);

				// Seller updates deposit status
				let tx3 = await hd.update_deposit_status(false, {
					from: accounts[0]
				});

				let deposit_refundable_2 = await hd.is_refundable();
				assert.equal(false, deposit_refundable_2);
				assert.equal("deposit_status_updated", tx3.logs[0].event);

				let pre_seller_balance = Number(await web3.eth.getBalance(accounts[0]));

				// Buyer updates their status
				let tx4 = await hd.update_status(false, {
					from: accounts[1]
				});

				let post_seller_balance = Number(await web3.eth.getBalance(accounts[0]));
				assert.isAbove(post_seller_balance, pre_seller_balance);

				let deposit = await hd.get_deposit_amount();
				assert.equal(0, deposit);
			});

			it("refunds deposit", async () => {
				// Buyer deposits funds
				let tx1 = await hd.deposit_funds({
					from: accounts[1],
					value: web3.utils.toWei('5', 'ether')
				});

				let pre_buyer_balance = Number(await web3.eth.getBalance(accounts[1]));

				// Buyer updates their status
				let tx4 = await hd.update_status(false, {
					from: accounts[1]
				});

				let post_buyer_balance = Number(await web3.eth.getBalance(accounts[1]));
				assert.isAbove(post_buyer_balance, pre_buyer_balance);

				let deposit = await hd.get_deposit_amount();
				assert.equal(0, deposit);
			});
		});
	});
});
