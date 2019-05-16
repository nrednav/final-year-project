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
	buyer_address: {
		type: String,
		require: true
	},
	seller_id: {
		type: String,
		require: true
	},
	seller_address: {
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
			holding_deposit_address: {
				type: String,
				default: ''
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
			sale_contract_id: {
				type: String,
				default: ""
			},
			signed_sale_contract_id: {
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

				1: {
					status: {
						type: String,
						default: "ASD"
					},
					buyer_deposit_status: {
						type: Boolean,
						default: false
					},
					seller_deposit_status: {
						type: Boolean,
						default: false
					},
					title_transfer_document_id: {
						type: String,
						default: ""
					},
					title_transfer_document_hash: {
						type: String,
						default: ""
					}
				},


				2: {
					status: {
						type: String,
						default: "Pending",
					}
				},


				3: {
					status: {
						type: String,
						default: "Pending",
					},
					title_deed_draft_id: {
						type: String,
						default: ""
					}
				},

				4: {
					status: {
						type: String,
						default: "Pending"
					},
					title_deed_id: {
						type: String,
						default: ""
					},
					hd_release_receipt: {
						type: String,
						default: ""
					},
					disbursement_receipt: {
						type: String,
						default: ""
					},
					finished_at: {
						type: String,
						default: ""
					}
				}
			},
			active_mini_stage: {
				type: Number,
				default: 1
			}
		}
	}
});

const Session = db.model('Session', SessionSchema);

module.exports = {
	Session
}
