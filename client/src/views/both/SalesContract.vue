<template>
	<v-layout column class="main-sc-container text-xs-center">

		<h1 class="display-3 p_text--text font-weight-bold">
			Stage 3: Sales Contract
		</h1>

		<div class="sc-card-container">
			<v-card class="primary p_text--text pa-4 sc-card display-1">

				<div class="sdoc-hash">
					<span class="sdoc-hash-label headline">
						Sale contract IPFS hash:-
					</span>
					<span class="sdoc-hash-value headline p_yellow--text">
						{{ contractIpfsHash }}
					</span>
				</div>

				<div class="bdoc-hash">
					<span class="bdoc-hash-label headline">
						Signed sale contract IPFS hash:-
					</span>
					<span class="bdoc-hash-value headline p_yellow--text">
						{{ signedContractIpfsHash }}
					</span>
				</div>

				<div class="uldl-buttons-container">

					<v-btn
						v-if="user_type == 'seller'"
						@click="$refs.scFileInput.click()"
						outline
						color="p_purple"
						class="title sc-button sc-button-upload">
						UPLOAD
					</v-btn>

					<v-btn
						v-if="user_type == 'buyer'"
						@click="downloadDocument"
						outline
						color="p_orange"
						class="title sc-button sc-button-upload">
						DOWNLOAD
					</v-btn>

					<input
						id="input"
						v-show="false"
						ref="scFileInput" type="file" @change="uploadDocument">

					<v-btn
						v-if="user_type == 'seller'"
						@click="downloadDocument"
						outline
						color="p_orange"
						class="title sc-button sc-button-download">
						DOWNLOAD
					</v-btn>

					<v-btn
						v-if="user_type == 'buyer'"
						@click="$refs.scFileInput.click()"
						outline
						color="p_purple"
						class="title sc-button sc-button-download">
						UPLOAD
					</v-btn>

				</div>

				<div class="nav-buttons-container">

					<v-btn
						@click="goBack"
						outline
						color="p_text"
						class="title sc-button sc-button-back">
						BACK
					</v-btn>

					<v-btn
						@click="handleContinue"
						outline
						color="p_blue"
						class="title sc-button sc-button-continue">
						CONTINUE
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
		}
	},

	methods: {

		updateSession (screeningUID, result) {
			var requestUrl = `http://localhost:3000/api/sessions/${this.session._id}/update`
			var config = { headers: { Authorization: 'a1b2c3d4e5f6g7' } }
			var body = {
				updateOptions: {
					$set: {
						'stages.2.buyer_screening_uid': screeningUID,
						'stages.2.verification_status': result,
						'stages.2.status': 'Completed'
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

		uploadDocument () {
			var files = event.target.files
			var selectedFile = files[0]
			console.log(selectedFile)
			var contractType = (this.user_type === 'seller') ? 'sc' : 'ssc'
			var requestUrl = `http://localhost:3000/api/sessions/${this.session._id}/upload-
			${contractType}`
			var config = { headers: { Authorization: 'a1b2c3d4e5f6g7' } }

			var formData = new FormData()
			formData.append('file', selectedFile)

			axios.post(requestUrl, formData, config).then((response) => {
				console.log(response)
			}).catch((error) => console.log(error))
		},

		downloadDocument () {
			var contractType = (this.user_type === 'seller') ? 'ssc' : 'sc'
			var requestUrl = `http://localhost:3000/api/sessions/${this.session._id}/contract/${contractType}`
			var config = { headers: { Authorization: 'a1b2c3d4e5f6g7' } }

			axios.get(requestUrl, config).then((response) => {
				console(response)
				return response
			}).catch((error) => console.log(error))
		},

		handleContinue () {

		},

		goBack () {
			this.$router.go(-1)
		}
	},

	computed: {

		...mapGetters(['session', 'user_type', 'user_object']),

		contractIpfsHash () {
			return this.session.stages['3'].seller_signed_contract_hash
		},

		signedContractIpfsHash () {
			return this.session.stages['3'].buyer_signed_contract_hash
		}
	},

	mounted () {
	}
}
</script>

<style>

.main-sc-container {
	display: grid;
	grid-template-columns: repeat(1, 1fr);
	justify-items: center;
	align-items: center;
	overflow-wrap: break-word;
	word-wrap: break-word;
	hyphens: auto;
}

.sc-card-container {
	margin-top: 10vh;
	margin-bottom: 10vh;
	width: 90%;
}

.sc-card {
	border-radius: 25px;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-template-rows: repeat(3, minmax(10vh, auto));
	column-gap: 10vmax;
	align-items: center;
	justify-items: center;
}

.sdoc-hash {
	margin-top: 5vmax;
	grid-column: 1 / 3;
	grid-row: 1;
	width: 100%;
	height: 100%;

	display: grid;
	grid-template-rows: repeat(2, 10vh);
	align-items: center;
	justify-items: center;
}

.bdoc-hash {
	grid-column: 1 / 3;
	grid-row: 2;
	width: 100%;
	height: 100%;

	display: grid;
	grid-template-rows: repeat(2, 10vh);
	align-items: center;
	justify-items: center;
}

.uldl-buttons-container {
	grid-column: 3 / 4;
	grid-row: 1 / 3;
	width: 100%;
	height: 100%;

	display: grid;
	grid-template-rows: repeat(2, 1fr);
	align-items: center;
	justify-items: center;
}

.nav-buttons-container {
	grid-column: 1 / 4;
	grid-row: 3;
	width: 100%;
	height: 100%;

	display: grid;
	grid-template-columns: repeat(3, 1fr);
	align-items: center;
	justify-items: center;
	margin-top: 3vmax;
}

.sc-button-back {
	grid-column: 1;
}

.sc-button-continue {
	grid-column: 3;
}

.sc-button {
	height: 10vh;
	width: 25vw;
	border-radius: 10px;
}

.disable-click {
	pointer-events: none;
	opacity: 0.5;
}

</style>
