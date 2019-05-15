pragma solidity ^0.5.7;


contract HoldingDepositFactory {

	// State
	mapping(bytes32 => address) holding_deposit_contracts;


	// Events
	event holding_deposit_created(bytes32 session_id_hash, address holding_deposit_contract);


	// Behaviour
	function open_holding_deposit(bytes32 _session_id_hash)
	public
	{
		address holding_deposit_contract = address(new HoldingDeposit(msg.sender));
		holding_deposit_contracts[_session_id_hash] = holding_deposit_contract;

		emit holding_deposit_created(_session_id_hash, holding_deposit_contract);
	}

	function get_holding_deposit_contract(bytes32 _session_id_hash)
	public view
	returns (address)
	{
		return holding_deposit_contracts[_session_id_hash];
	}
}

contract HoldingDeposit {

	// State
	address payable buyer;
	address payable seller;
	address private authority = 0x8a23c7C42333ed6be5a68c24031cd7A737fbcBE8;
	uint deposit;

	bool seller_status = false;
	bool buyer_status = false;
	bool open = false;
	bool locked = false;
	bool deposit_refundable = true;


	// Constructor
	constructor(address payable _seller)
	public
	{
		// Add seller to the contract
		seller = _seller;
		seller_status = true;
		open = true;
	}


	// Modifiers
	modifier openHolding() {
		require(open, "This holding deposit contract has closed.");
		_;
	}

	modifier onlyParticipants() {
		require(msg.sender == buyer || msg.sender == seller,
				 "Only participants in this contract can invoke these functions");
		_;
	}


	// Events
	event funds_deposited(address buyer, uint value);
	event status_updated(address sender, bool status);
	event deposit_status_updated(bool status);
	event deposit_withdrawn(address receiver, uint amount);
	event hd_closed();

	// Functions
	function deposit_funds()
	public payable openHolding
	{
		require(!locked, "No more deposits");
		require(msg.sender != seller, "Seller cannot deposit into their own holding.");
		locked = true;

		buyer = msg.sender;
		deposit = msg.value;
		buyer_status = true;

		emit funds_deposited(msg.sender, msg.value);
	}

	function update_status(bool _status)
	public openHolding onlyParticipants
	{
		if (msg.sender == buyer) {
			buyer_status = _status;
		}
		else {
			seller_status = _status;
		}

		emit status_updated(msg.sender, _status);

		check_deposit_status();
	}

	function update_deposit_status(bool _status)
	public openHolding onlyParticipants
	{
		require(msg.sender == seller, "Only the seller can initiate an update to the deposit status");
		deposit_refundable = _status;
		emit deposit_status_updated(_status);
	}

	function withdraw(address payable _receiver)
	private
	{
		require(_receiver == seller || _receiver == buyer, "Only participants can have funds withdrawn.");

		if (deposit != 0) {

			uint deposit_amount = deposit;
			deposit = 0;
			address payable receiver;

			// Determine receiver of deposit
			if (_receiver == seller) {
				receiver = seller;
			}
			else {
				receiver = buyer;
			}

			// Withraw the deposit
			receiver.transfer(deposit_amount);
			emit deposit_withdrawn(receiver, deposit_amount);
		}

		// Close the holding deposit contract
		open = false;
		emit hd_closed();
	}

	function check_deposit_status()
	private
	{
		// If seller says no, buyer is refunded deposit
		if (seller_status == false) {
			withdraw(buyer);
		}
		else if (buyer_status == false) {
			// Check status of deposit
			if (deposit_refundable) {
				withdraw(buyer);
			}
			else if (!deposit_refundable) {
				withdraw(seller);
			}
		}
	}

		// Release deposit upon escrow completion
	function release_deposit()
	public
	{
		require(msg.sender == authority, "Authorization unsuccessful");
		withdraw(buyer);
	}


	// Getters
	function get_participants()
	public view
	returns (address, address)
	{
		return (seller, buyer);
	}

	function is_refundable()
	public view
	returns (bool)
	{
		return deposit_refundable;
	}

	function is_open()
	public view
	returns (bool)
	{
		return open;
	}

	function get_deposit_amount()
	public view
	returns (uint)
	{
		return deposit;
	}

	function get_buyer_status()
	public view openHolding
	returns (bool)
	{
		return buyer_status;
	}

	function get_seller_status()
	public view openHolding
	returns (bool)
	{
		return seller_status;
	}
}
