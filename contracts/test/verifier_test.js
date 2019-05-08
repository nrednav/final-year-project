const Verifier = artifacts.require("Verifier");

contract("Verifier", accounts => {

	let verifier_instance;

	beforeEach(async () => {
		verifier_instance = await Verifier.new();
	});

	it("should emit an event when verification is requested", async () => {
		let property_uid = "0xdc345837d24517858368a28c2022936404ae5a64e78dcac16331108d53eeca9c";

		let result = await verifier_instance.verify(property_uid);

		assert.equal(result.logs[0].event, "verification_requested");
	});

	it("should emit the property_uid as part of the event", async () => {
		let property_uid = "0xdc345837d24517858368a28c2022936404ae5a64e78dcac16331108d53eeca9c";
		let result = await verifier_instance.verify(property_uid);
		assert.equal(result.logs[0].args.property_uid, property_uid);
	});
});
