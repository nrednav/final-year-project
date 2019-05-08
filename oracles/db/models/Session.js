const mongoose = require('mongoose');
const db = require('../connection');

const SessionSchema = new mongoose.Schema({
	property_id: {
		type: String,
		require: true,
		unique: true
	},
	buyer_id: {
		type: String,
		require: true
	},
	seller_id: {
		type: String,
		require: true
	},
	created_at: {
		type: Date,
		default: Date.now
	},
	progress: {
		type: Number,
		default: 0
	},
	stages: {
		1: {
			name: {
				type: String,
				default: "Holding Deposit"
			},
			status: {
				type: String,
				default: "Pending",
				enum: ["Pending", "In Progress", "Completed"]
			},
			deposit_amount: {
				type: Number,
				default: 0
			},
			deadline: {
				type: Date,
				default: Date.now
			},
			deposit_status: {
				type: String,
				default: "ASR",
				enum: ["ASR", "ABP", "Paid"]
			}
		},
		2: {
			name: {
				type: String,
				default: "Background Screening"
			},
			status: {
				type: String,
				default: "Pending",
				enum: ["Pending", "In Progress", "Completed"]
			},
			verification_status: {
				type: String,
				default: "ASR",
				enum: ["ASR", "Pending", "Verified", "Failed"]
			},
			buyer_screening_uid: {
				type: String,
				default: ""
			}
		},
		3: {
			name: {
				type: String,
				default: "Sales Contract"
			},
			status: {
				type: String,
				default: "Pending",
				enum: ["Pending", "In Progress", "Completed"]
			},
			contract_status: {
				type: String,
				default: "ASCS",
				enum: ["ASCS", "ASCB", "ASCH", "Signed"]
			},
			buyer_signed_contract_hash: {
				type: String,
				default: ""
			},
			seller_signed_contract_hash: {
				type: String,
				default: ""
			},
			sc_hashes: {
				buyer: {
					type: String,
					default: ""
				},
				seller: {
					type: String,
					default: ""
				}
			},
			sc_hash_status: {
				type: Boolean,
				default: false
			},
			agreed_sale_price: {
				type: Number,
				default: 0
			}
		},
		4: {
			name: {
				type: String,
				default: "Escrow"
			},
			status: {
				type: String,
				default: "Pending",
				enum: ["Pending", "In Progress", "Completed"]
			},
			escrow_contract_address: {
				type: String,
				default: ""
			},
			mini_stages: {
				1:
				{
					name: {
						type: String,
						default: "Deposits"
					},
					status: {
						type: String,
						default: "Pending",
						enum: ["Pending", "In Progress", "Completed"]
					},
					buyer_deposit_status: {
						type: String,
						default: "Pending",
						enum: ["Pending", "Complete"]
					},
					seller_deposit_status: {
						type: String,
						default: "Pending",
						enum: ["Pending", "Complete"]
					}
				},
				2:
				{
					name: {
						type: String,
						default: "Verification"
					},
					status: {
						type: String,
						default: "ATTR",
						enum: ["ATTR", "APR", "Complete"]
					},
					title_transfer_receipt: {
						type: String,
						default: ""
					},
					buyer_approval: {
						type: Boolean,
						default: false
					},
					seller_approval: {
						type: Boolean,
						default: false
					}
				},
				3:
				{
					name: {
						type: String,
						default: "Disbursement"
					},
					status: {
						type: String,
						default: "Pending",
						enum: ["Pending", "Complete"]
					},
					buyer_greenlight: {
						type: Boolean,
						default: false
					},
					seller_greenlight: {
						type: Boolean,
						default: false
					},
					disbursements: {
						buyer: {
							title_deed_hash: {
								type: String,
								default: ""
							},
							holding_deposit_tx_receipt: {
								type: String,
								default: ""
							}
						},
						seller: {
							payment_tx_receipt: {
								type: String,
								default: ""
							}
						}
					}
				}
			},
			active_mini_stage: {
				type: Number,
				default: 0
			}
		}
	}
});

const Session = db.model('Session', SessionSchema);

module.exports = {
	Session
}
