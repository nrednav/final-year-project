pragma solidity ^0.5.7;

contract EscrowFactory {

	// State
	mapping(bytes32 => address) escrow_contracts;

	// Events
	event escrow_opened(bytes32 session_id_hash, address escrow_contract);

	// Behaviour
	function open_escrow(bytes32 _title_transfer_hash, bytes32 _session_id_hash)
	public
	{
		address escrow = address(new Escrow(_title_transfer_hash, msg.sender));
		escrow_contracts[_session_id_hash] = escrow;

		emit escrow_opened(_session_id_hash, escrow);
	}

	function get_escrow(bytes32 _session_id_hash)
	public view
	returns (address)
	{
		return escrow_contracts[_session_id_hash];
	}
}

contract Escrow {

	// State
	address buyer;
	address payable seller;
	uint funds;
	bytes32 title_transfer_hash;

	bool buyer_greenlight;
	bool seller_greenlight;

	bool open = false;
	bool locked = true;


	// Events
	event buyer_deposit_complete();
	event title_transfer_requested(string session_id, bytes32 title_transfer_hash);
	event funds_disbursed();
	event escrow_closed();


	// Constructor
	constructor(bytes32 _title_transfer_hash, address payable _seller)
	public
	{
		seller = _seller;
		title_transfer_hash = _title_transfer_hash;
		open = true;
		locked = false;
	}


	// Modifiers
	modifier openEscrow() {
		require(open, "The escrow is closed.");
		_;
	}


	// Behaviour

		// Handle deposits
	function deposit()
	public payable openEscrow
	{
		require(msg.sender != seller);
		require(locked == false, "Sorry the escrow is now locked");

		locked = true;

		buyer = msg.sender;
		funds = msg.value;

		emit buyer_deposit_complete();
	}

		// Handle title transfer request
	function request_title_transfer(string memory _session_id)
	public openEscrow
	{
		require(msg.sender == seller, "Only the seller can request a title transfer.");
		emit title_transfer_requested(_session_id, title_transfer_hash);
	}

		// Handle buyer and seller responses to title transfer completion
	function greenlight(bool _response)
	public openEscrow
	{
		require(msg.sender == seller || msg.sender == buyer);

		if (msg.sender == seller) {
			seller_greenlight = _response;
		}
		else if (msg.sender == buyer) {
			buyer_greenlight = _response;
		}

		if (buyer_greenlight && seller_greenlight) {
			disburse_funds();
		}
	}

		// Handle disbursement of funds and closing of escrow
	function disburse_funds()
	private openEscrow
	{
		require(buyer_greenlight == true && seller_greenlight == true,
				  "Need both parties to agree before any funds are disbursed.");

		uint amount = funds;
		funds = 0;
		seller.transfer(amount);

		emit funds_disbursed();

		// ! INSERT SOME CODE HERE TO INIATE REFUND OF HOLDING DEPOSIT TO BUYER ! //

		open = false;

		emit escrow_closed();
	}


	// Getters
	function get_participants()
	public view
	returns (address, address)
	{
		return (seller, buyer);
	}

	function is_open()
	public view
	returns (bool)
	{
		return open;
	}

	function is_deposit_locked()
	public view
	returns (bool)
	{
		return locked;
	}
}
