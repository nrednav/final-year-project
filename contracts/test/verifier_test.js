const Verifier = artifacts.require("Verifier");

contract("Verifier", accounts => {

	let verifier_instance;

	beforeEach(async () => {
		verifier_instance = await Verifier.new();
	});

	it("should emit an event when verification is requested", async () => {
		let title_deed_hash = "0xdc345837d24517858368a28c2022936404ae5a64e78dcac16331108d53eeca9c";
		let owner_forename = "Bob";
		let owner_surname = "Jenkins";

		let result = await verifier_instance.verify(title_deed_hash, owner_forename, owner_surname);
		assert.equal(result.logs[0].event, "verification_requested");
		assert.equal(result.logs[0].args.title_deed_hash, title_deed_hash, "Incorrect title deed hash emitted");
		assert.equal(result.logs[0].args.owner_forename, owner_forename, "Incorrect owner forename emited");
		assert.equal(result.logs[0].args.owner_surname, owner_surname, "Incorrect owner surname emitted");
	});

	it("should emit an event when verification is completed", async () => {
		let title_deed_hash = "0xdc345837d24517858368a28c2022936404ae5a64e78dcac16331108d53eeca9c";

		let result = await verifier_instance.verified("0xdc345837d24517858368a28c2022936404ae5a64e78dcac16331108d53eeca9c", true);
		assert.equal(result.logs[0].event, "verification_completed");
		assert.equal(result.logs[0].args.title_deed_hash, title_deed_hash, "Incorrect title deed emitted");
		assert.equal(result.logs[0].args.result, true, "Incorrect verification result");
	});
});
