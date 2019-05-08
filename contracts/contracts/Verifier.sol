pragma solidity 0.5.7;

contract Verifier {

	// Events
	event verification_requested(bytes32 property_uid);

	// Functions
	function verify(bytes32 _property_uid)
	public
	{
		emit verification_requested(_property_uid);
	}
}
