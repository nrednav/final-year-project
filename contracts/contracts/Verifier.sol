pragma solidity 0.5.7;

contract Verifier {

	// Events
	event verification_requested(bytes32 title_deed_hash,
										  string owner_forename,
										  string owner_surname);

	event verification_completed(bytes32 title_deed_hash,
										  bool result);

	// Functions
	function verify(bytes32 _title_deed_hash,
						 string memory _owner_forename,
						 string memory _owner_surname)
	public
	{
		emit verification_requested(_title_deed_hash, _owner_forename, _owner_surname);
	}

	function verified(bytes32 _title_deed_hash, bool _result)
	public
	{
		emit verification_completed(_title_deed_hash, _result);
	}
}
