<template>
	<v-layout column class="main-hd-container text-xs-center">

		<h1 class="display-3 p_text--text font-weight-bold">
			Stage 1: Holding Deposit
		</h1>

		<div class="hd-card-container">
			<v-card class="primary p_text--text pa-4 hd-card display-1">

				<div class="hd-amount">
					Amount:
					<span class="hd-amount-value p_input_text--text">
						{{ session.stages['1'].deposit_amount }}</span>
				</div>

				<div class="hd-status">
					Status:
					<span class="hd-status-value p_input_text--text">
						{{ session.stages['1'].deposit_status }}
					</span>
				</div>

				<div class="hd-deadline pr-4">
					Deadline:
					<span class="hd-deadline-value p_input_text--text">
						{{ session.stages['1'].deadline.substr(0,10) }}
					</span>
				</div>

				<div v-if="user_type == 'buyer'" class="hdb-button-container">
					<v-btn
						@click="goBack"
						color="p_text" outline class="title hd-btnBack">
						BACK
					</v-btn>

					<v-btn
						@click="payDeposit"
						:class="{'disable-click': depositStatus != 'ABP' }"
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
						@click="setDeadline"
						:class="{'disable-click': depositStatus != 'ASR' }"
						color="p_purple" outline class="title hd-btnSetDeadline">
						SET DEADLINE
					</v-btn>

					<v-btn
						@click="requestDeposit"
						:class="{'disable-click': depositStatus != 'ASR' }"
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

export default {
	data () {
		return {
			selectedAddr: '',
			selectedDeadline: ''
		}
	},

	methods: {

		decodeDepositStatus () {
			var status = this.depositStatus
			if (status === 'ASR') {
				return 'Awaiting seller\'s request'
			} else if (status === 'ABP') {
				return 'Awaiting buyer\'s payment'
			}
			return 'Paid'
		},

		setDeadline () {
			var requestUrl = `http://localhost:3000/api/sessions/${this.session._id}/update`
			var config = { headers: { Authorization: 'a1b2c3d4e5f6g7' } }
			var body = {
				updateOptions: {
					$set: { 'deadline': this.selectedDeadline }
				}
			}
			axios.put(requestUrl, body, config).then((response) => {
				console.log(response)
			}).catch((error) => console.log(error))
		},

		requestDeposit () {

		},

		async payDeposit () {
			if (this.selectedAddr !== '') {
				alert('Please login to metamask to continue')
				if (this.selectAddr !== this.user_object.account_address) {
					alert('Please use the account that you signed up with')
				}
			} else {
				// Make payment to hd contract
			}
		},

		async load_accounts () {
			if (window.ethereum !== 'undefined') {
				let addresses = await window.ethereum.enable()
				this.selected_addr = addresses[0]
			} else {
				alert('Please download and install the Metamask browser addon to continue')
			}
		},

		goBack () {
			this.$router.go(-1)
		}
	},

	computed: {
		...mapGetters(['session', 'user_type']),

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

.hd-btnSetDeadline {
	grid-column: 2 / 3;
	grid-row: 3;
	height: 10vh;
	width: 25vw;
	border-radius: 10px;
}

.hd-btnRequestDeposit {
	grid-column: 3 / 3;
	grid-row: 3;
	height: 10vh;
	width: 25vw;
	border-radius: 10px;
}

.hds-button-container {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
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
