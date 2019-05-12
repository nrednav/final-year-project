<template>
	<v-layout column class="main-bs-container text-xs-center">

		<h1 class="display-3 p_text--text font-weight-bold">
			Stage 2: Background Screening
		</h1>

		<div class="bs-card-container">
			<v-card class="primary p_text--text pa-4 bs-card display-1">

				<div class="bs-screening-uid">
					Screening UID:
					<span
						v-if="session.stages['2'].buyer_screening_uid == ''"
						class="bs-uid-value headline p_input_text--text">
						N/A
					</span>
					<span
						v-else class="bs-uid-value headline p_input_text--text">
						{{ session.stages['2'].buyer_screening_uid }}
					</span>
				</div>

				<div class="bs-verification-status">
					Verification Status:
					<span
						v-if="session.stages['2'].verification_status != 'Verified'"
						class="bs-uid-value p_input_text--text headline">
						{{ session.stages['2'].verification_status }}
					</span>
					<span
						v-if="session.stages['2'].verification_status == 'Verified'"
						class="bs-uid-value p_green--text headline">
						{{ session.stages['2'].verification_status }}
					</span>
				</div>

				<div v-if="user_type == 'buyer'" class="bsb-button-container">
					<v-btn
						@click="goBack"
						color="p_text" outline class="title bs-btnBack">
						BACK
					</v-btn>
				</div>

				<div v-if="user_type == 'seller'" class="bss-button-container">
					<v-btn
						@click="goBack"
						color="p_text" outline class="title bs-btnBack">
						BACK
					</v-btn>

					<v-btn
						v-if="session.stages['2'].status != 'Completed' && !verificationRequested"
						@click="obtainVerification"
						color="p_purple" outline class="title bs-btnObtainVerification">
						OBTAIN VERIFICATION
					</v-btn>
				</div>

			</v-card>
		</div>

	</v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
	data () {
		return {
			verificationRequested: false
		}
	},

	methods: {

		obtainVerification () {
			var buyerAddress = this.session.buyer_address
			var requestUrl = `http://localhost:3000/api/screening/get-report/${buyerAddress}`
			var config = { headers: { Authorization: 'a1b2c3d4e5f6g7' } }

			axios.get(requestUrl, config).then((response) => {
				var screeningUID = response.data.screening_uid
				var verificationResult = response.data.verified ? 'Verified' : 'Failed'
				this.updateSession(screeningUID, verificationResult)
			}).catch((error) => {
				console.log(error)
			})
		},

		updateSession (screeningUID, result) {
			var requestUrl = `http://localhost:3000/api/sessions/${this.session._id}/update`
			var config = { headers: { Authorization: 'a1b2c3d4e5f6g7' } }
			var body = {
				updateOptions: {
					$set: {
						'stages.2.buyer_screening_uid': screeningUID,
						'stages.2.verification_status': result,
						'stages.2.status': 'Completed',
						'progress': 2
					}
				}
			}

			axios.put(requestUrl, body, config).then((response) => {
				console.log(response)
				this.verificationRequested = true
			}).catch((error) => {
				console.log(error)
			})
		},

		goBack () {
			this.$router.go(-1)
		}
	},

	computed: {
		...mapGetters(['session', 'user_type', 'user_object'])
	},

	mounted () {
	}
}
</script>

<style>

.main-bs-container {
	display: grid;
	grid-template-columns: repeat(1, 1fr);
	justify-items: center;
	align-items: center;
	overflow-wrap: break-word;
	word-wrap: break-word;
	hyphens: auto;
}

.bs-card-container {
	margin-top: 10vh;
	width: 90%;
}

.bs-card {
	border-radius: 25px;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-template-rows: repeat(3, minmax(10vh, auto));
	column-gap: 10vmax;
	row-gap: 2vmax;
	align-items: center;
	justify-items: start;
}

.bs-screening-uid {
	grid-column: 1 / 3;
	grid-row: 1;
	width: 100%;
	height: 100%;
}

.bs-verification-status {
	grid-column: 1 / 3;
	grid-row: 2;
	width: 100%;
	height: 100%;
}

.bs-btnBack {
	grid-column: 1;
	grid-row: 3;
	height: 10vh;
	width: 25vw;
	border-radius: 10px;
}

.bs-btnPayDeposit {
	grid-column: 2 / 3;
	grid-row: 3;
	height: 10vh;
	width: 25vw;
	border-radius: 10px;
}

.bs-btnObtainVerification {
	grid-column: 2 / 3;
	grid-row: 3;
	height: 10vh;
	width: 25vw;
	border-radius: 10px;
}

.bss-button-container {
	justify-items: center;
	grid-column: 1 / 3;
	width: 100%;
}

.bsb-button-container {
	grid-column: 1 / 3;
	width: 100%;
}

.disable-click {
	pointer-events: none;
	opacity: 0.5;
}

.bs-uid-value {
	grid-column: 2;
}

</style>
