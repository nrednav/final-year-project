<template>
	<v-layout column class="main-hd-container text-xs-center">

		<h1 class="display-3 p_text--text font-weight-bold">
			Stage 1: Holding Deposit
		</h1>

		<div class="hd-card-container">
			<v-card class="primary p_text--text pa-4 hd-card display-1">

				<div class="hd-amount">
					Amount:
					<span
						v-if="user_type == 'buyer' || depositStatus != 'ASR'"
						class="hd-amount-value p_input_text--text">
						{{ session.stages['1'].deposit_amount }}</span>
					<input
						v-if="user_type == 'seller' && depositStatus == 'ASR'"
						v-model="selectedDeposit"
						type="text"
						placeholder="Enter a deposit amount"
						class="hd-deposit-input pa-4 p_input_text--text p_input title">
				</div>

				<div class="hd-status">
					Status:
					<span class="hd-status-value p_input_text--text">
						{{ session.stages['1'].deposit_status }}
					</span>
				</div>

				<div class="hd-deadline pr-4">
					Deadline:
					<span
						v-if="user_type == 'buyer' || depositStatus != 'ASR'"
						class="hd-deadline-input p_input_text--text">
						{{ session.stages['1'].deadline.substr(0,10) }}
					</span>
					<input
						v-if="user_type == 'seller' && depositStatus == 'ASR'"
						v-model="selectedDeadline"
						type="text"
						placeholder="(YYYY-MM-DD)"
						class="hd-deposit-input pa-4 p_input_text--text p_input title">
				</div>

				<div v-if="user_type == 'buyer'" class="hdb-button-container">
					<v-btn
						@click="goBack"
						color="p_text" outline class="title hd-btnBack">
						BACK
					</v-btn>

					<v-btn
						@click="payDeposit"
						v-if="depositStatus != 'Paid' && !depositPaid"
						:class="{'disable-click': depositStatus == 'ASR' }"
						color="p_blue" outline class="title hd-btnPayDeposit">
						PAY DEPOSIT
					</v-btn>
				</div>

				<div v-if="user_type == 'seller'" class="hds-button-container">
					<v-btn
						@click="goBack"
						color="p_text" outline class="title hd-btnBack">
						BACK
					</v-btn>

					<v-btn
						v-if="depositStatus == 'ASR'"
						@click="requestDeposit"
						color="p_blue" outline class="title hd-btnRequestDeposit">
						REQUEST DEPOSIT
					</v-btn>
				</div>

			</v-card>
		</div>

	</v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
import web3 from '@/web3'
import holdingDepositFactory from '@/contracts/holdingDepositFactory'
import holdingDeposit from '@/contracts/holdingDeposit'

export default {
	data () {
		return {
			selectedAddr: '',
			selectedDeadline: '',
			selectedDeposit: '',
			depositPaid: false
		}
	},

	methods: {

		setRequestData () {
			var requestUrl = `http://localhost:3000/api/sessions/${this.session._id}/update`
			var config = { headers: { Authorization: 'a1b2c3d4e5f6g7' } }
			var body = {
				updateOptions: {
					$set: {
						'stages.1.deadline': this.selectedDeadline,
						'stages.1.deposit_amount': Number(this.selectedDeposit),
						'stages.1.status': 'In Progress',
						'stages.1.deposit_status': 'ABP'
					}
				}
			}
			axios.put(requestUrl, body, config).then((response) => {
				console.log(response)
				if (response.data.includes('Success')) {
					this.$router.go(-1)
				}
			}).catch((error) => console.log(error))
		},

		async createHdContract () {
			if (this.selectedAddr !== '') {
				if (this.selectedAddr === this.user_object.account_address) {
					var sessionIdHash = await web3.utils.sha3(this.session._id)

					holdingDepositFactory.methods.open_holding_deposit(sessionIdHash).send({
						from: this.selectedAddr,
						gasPrice: web3.utils.toWei('42', 'gwei')
					}).on('transactionHash', (hash) => {
						console.log(hash)
						this.setRequestData()
					}).catch((error) => console.log(error))
				} else {
					alert('Please switch accounts to the one you used during registration')
				}
			} else {
				alert('Please login to metamask to continue')
			}
		},

		validateInputs () {
			var deadlineRegex = /^\d{4}-\d{2}-\d{2}$/
			if (!this.selectedDeadline.match(deadlineRegex)) {
				alert('Please enter a date in the format YYYY-MM-DD')
				return false
			} else if (Number(this.selectedDeadline.substr(5, 2)) > 12) {
				alert('Invalid month entered')
				return false
			} else if (Number(this.selectedDeadline.substr(8, 2)) > 31) {
				alert('Invalid day entered')
				return false
			}
			if (this.selectedDeposit.match(/[a-z]/i)) {
				alert('Please enter a number for the deposit amount')
				return false
			}
			return true
		},

		requestDeposit () {
			var validInputs = this.validateInputs()
			if (validInputs) {
				// this.setRequestData()
				this.createHdContract()
			}
		},

		async payDeposit () {
			if (this.selectedAddr !== '') {
				if (this.selectedAddr !== this.user_object.account_address) {
					alert('Please use the account that you signed up with')
				} else {
					// Make payment to hd contract
					var sessionIdHash = web3.utils.sha3(this.session._id)
					var hdAddress = await holdingDepositFactory.methods.get_holding_deposit_contract(sessionIdHash).call()

					// Update the session to store this HD address in stage 1
					var requestUrl = `http://localhost:3000/api/sessions/${this.session._id}/update`
					var config = { headers: { Authorization: 'a1b2c3d4e5f6g7' } }
					var body = {
						updateOptions: {
							$set: {
								'stages.1.holding_deposit_address': hdAddress
							}
						}
					}

					axios.put(requestUrl, body, config).then((response) => {
						var depositAmount = this.session.stages['1'].deposit_amount / 10000
						// Make the deposit
						holdingDeposit.address = hdAddress
						holdingDeposit.methods.deposit_funds().send({
							from: this.selectedAddr,
							value: web3.utils.toWei(depositAmount.toString(), 'ether')
						}).on('transactionHash', (hash) => {
							console.log(hash)
							this.depositPaid = true
						}).catch((error) => {
							console.log(error)
							this.depositPaid = false
						})
					}).catch((error) => console.log(error))
				}
			} else {
				alert('Please login to metamask to continue')
			}
		},

		async load_accounts () {
			if (window.ethereum !== 'undefined') {
				let addresses = await window.ethereum.enable()
				this.selectedAddr = addresses[0]
			} else {
				alert('Please download and install the Metamask browser addon to continue')
			}
		},

		goBack () {
			this.$router.go(-1)
		}
	},

	computed: {
		...mapGetters(['session', 'user_type', 'user_object']),

		depositStatus () {
			return this.session.stages['1'].deposit_status
		}
	},

	mounted () {
		this.load_accounts()
	}
}
</script>

<style>

.main-hd-container {
	display: grid;
	grid-template-columns: repeat(1, 1fr);
	justify-items: center;
	align-items: center;
	overflow-wrap: break-word;
	word-wrap: break-word;
	hyphens: auto;
}

.hd-card-container {
	margin-top: 10vh;
	width: 90%;
}

.hd-card {
	border-radius: 25px;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-template-rows: repeat(3, minmax(10vh, auto));
	column-gap: 10vmax;
	row-gap: 2vmax;
	align-items: center;
	justify-items: start;
}

.hd-amount {
	grid-column: 1;
	grid-row: 1;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	align-items: center;
	column-gap: 2vmax;
	width: 100%;
	height: 100%;
}

.hd-status {
	grid-column: 1;
	grid-row: 2;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	align-items: center;
	column-gap: 2vmax;
	width: 100%;
	height: 100%;
}

.hd-deadline {
	grid-column: 2;
	grid-row: 1;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	align-items: center;
	column-gap: 2vmax;
	width: 100%;
	height: 100%;
}

.hd-btnBack {
	grid-column: 1;
	grid-row: 3;
	height: 10vh;
	width: 25vw;
	border-radius: 10px;
}

.hd-btnPayDeposit {
	grid-column: 2 / 3;
	grid-row: 3;
	height: 10vh;
	width: 25vw;
	border-radius: 10px;
}

.hd-btnRequestDeposit {
	grid-column: 2 / 3;
	grid-row: 3;
	height: 10vh;
	width: 25vw;
	border-radius: 10px;
}

.hd-deposit-input {
	grid-column: 2;
	text-align: center;
	padding: 10px;
	border-radius: 25px;
}

.hd-deadline-input {
	grid-column: 2;
	text-align: center;
	padding: 10px;
	border-radius: 25px;
}

.hds-button-container {
	justify-items: center;
	grid-column: 1 / 3;
	width: 100%;
}

.hdb-button-container {
	grid-column: 1 / 3;
	width: 100%;
}

.disable-click {
	pointer-events: none;
	opacity: 0.5;
}

</style>
