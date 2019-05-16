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
		address escrow = address(new Escrow(_title_transfer_hash, msg.sender, _session_id_hash));
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
	address payable buyer;
	address payable seller;
	address private escrowOracle;
	uint funds;

	bytes32 title_transfer_hash;
	bytes32 session_id_hash;
	bytes32 title_draft_hash;

	bool buyer_transfer_greenlight = false;
	bool seller_transfer_greenlight = false;

	bool buyer_title_draft_greenlight = false;
	bool seller_title_draft_greenlight = false;

	bool open = false;
	bool locked = false;
	bool terminated = false;


	// Events
	event buyer_deposit_complete();
	event title_transfer_requested();
	event funds_disbursed();
	event escrow_closed();
	event escrow_terminated(address requester);
	event commit_title_transfer();
	event release_holding_deposit();


	// Constructor
	constructor(bytes32 _title_transfer_hash, address payable _seller, bytes32 _session_id_hash)
	public
	{
		// Setup the seller
		seller = _seller;
		title_transfer_hash = _title_transfer_hash;
		session_id_hash = _session_id_hash;
		seller_transfer_greenlight = true;
		escrowOracle = 0x8a23c7C42333ed6be5a68c24031cd7A737fbcBE8;
		open = true;
	}


	// Modifiers
	modifier openEscrow() {
		require(open, "The escrow is closed.");
		_;
	}

	modifier notTerminated() {
		require(!terminated, "The escrow was terminated.");
		_;
	}


	// Behaviour

		// Handle deposits
	function deposit(bytes32 _title_transfer_hash)
	public payable openEscrow
	{
		require(msg.sender != seller);
		require(locked == false, "Sorry the escrow is now locked");
		require(_title_transfer_hash == title_transfer_hash, "Sorry that is an invalid title transfer hash");

		locked = true;

		buyer = msg.sender;
		funds = msg.value;
		buyer_transfer_greenlight = true;

		emit buyer_deposit_complete();
	}

		// Handle title transfer request
	function request_title_transfer()
	public openEscrow
	{
		require(msg.sender == seller, "Only the seller can request a title transfer.");
		emit title_transfer_requested();
	}

		// Handle title transfer response
	function title_transfer_response(bytes32 _title_draft_hash)
	public openEscrow
	{
		require(msg.sender == escrowOracle, "Authorization unsuccessful");
		title_draft_hash = _title_draft_hash;
	}

		// Handle buyer and seller responses to title transfer completion
	function title_draft_greenlight(bytes32 _title_draft_hash, bool _status)
	public openEscrow
	{
		require(msg.sender == seller || msg.sender == buyer);
		require(_title_draft_hash == title_draft_hash, "Title draft hash mismatch");

		if (msg.sender == seller) {
			seller_title_draft_greenlight = _status;
		}
		else if (msg.sender == buyer) {
			buyer_title_draft_greenlight = _status;
		}

		if (buyer_title_draft_greenlight && seller_title_draft_greenlight) {
			emit commit_title_transfer();
			disburse_funds();
		}
	}

		// Handle disbursement of funds and closing of escrow
	function disburse_funds()
	private openEscrow
	{
		require(buyer_title_draft_greenlight == true && seller_title_draft_greenlight == true,
				  "Need both parties to agree before any funds are disbursed.");

		uint amount = funds;
		funds = 0;
		seller.transfer(amount);

		emit funds_disbursed();
		emit release_holding_deposit();

		open = false;
		emit escrow_closed();
	}

		// Handle requests to leave the session
	function terminate_escrow()
	public openEscrow notTerminated
	{
		require(msg.sender == seller || msg.sender == buyer);

		// Release funds back to buyer
		uint amount = funds;
		funds = 0;
		buyer.transfer(amount);

		terminated = true;
		emit escrow_terminated(msg.sender);

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
