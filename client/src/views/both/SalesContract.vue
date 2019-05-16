<template>
	<v-layout column class="main-sc-container text-xs-center">

		<h1 class="display-3 p_text--text font-weight-bold">
			Stage 3: Sales Contract
		</h1>

		<div class="sc-card-container">
			<v-card
				class="primary p_text--text pa-4 sc-card display-1">

				<div class="sdoc-status">
					<span class="sdoc-status-label headline">
						Sale contract available:
					</span>
					<span
						class="sdoc-status-value headline p_yellow--text">
							<v-icon large color="p_green" v-if="saleContractAvailable">
								fas fa-check
							</v-icon>
							<v-icon large color="p_red" v-if="!saleContractAvailable">
								fas fa-times
							</v-icon>
					</span>
				</div>

				<div class="bdoc-status">
					<span class="bdoc-status-label headline">
						Signed sale contract available:
					</span>
					<span
						class="bdoc-status-value headline p_yellow--text">
							<v-icon large color="p_green" v-if="signedSaleContractAvailable">
								fas fa-check
							</v-icon>
							<v-icon large color="p_red" v-if="!signedSaleContractAvailable">
								fas fa-times
							</v-icon>
					</span>
				</div>

				<div class="sc-contract-status">
					<span class="sc-contract-status-label headline">
						Status:
					</span>
					<span class="sc-contract-status-value headline p_yellow--text">
						{{ this.session.stages['3'].contract_status }}
					</span>
				</div>

				<div
					class="uldl-buttons-container">

					<v-btn
						v-if="user_type == 'seller' && stageNotCompleted"
						@click="$refs.scFileInput.click()"
						outline
						color="p_purple"
						class="title sc-button sc-button-upload">
						UPLOAD
					</v-btn>

					<v-btn
						v-if="user_type == 'buyer' && saleContractAvailable"
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
						v-if="user_type == 'seller' && signedSaleContractAvailable"
						@click="downloadDocument"
						outline
						color="p_orange"
						class="title sc-button sc-button-download">
						DOWNLOAD
					</v-btn>

					<v-btn
						v-if="user_type == 'buyer' && saleContractAvailable && stageNotCompleted"
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
						v-if="saleContractAvailable && signedSaleContractAvailable
								&& user_type == 'seller' && stageNotCompleted"
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
import FileSaver from 'file-saver'

export default {
	data () {
		return {
		}
	},

	methods: {

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
				this.$router.go(-1)
			}).catch((error) => console.log(error))
		},

		downloadDocument () {
			var contractType = (this.user_type === 'seller') ? 'ssc' : 'sc'
			var requestUrl = `http://localhost:3000/api/sessions/${this.session._id}/contract/${contractType}`
			var config = {
				headers: {
					Authorization: 'a1b2c3d4e5f6g7'
				},
				responseType: 'blob'
			}

			axios.get(requestUrl, config).then((response) => {
				console.log(response)
				var fileType = response.headers['content-type']
				var fileName = (contractType === 'ssc') ? 'signed-sale-contract' : 'sale-contract'
				FileSaver.saveAs(response.data, fileName, { type: fileType })
			}).catch((error) => console.log(error))
		},

		handleContinue () {
			var requestUrl = `http://localhost:3000/api/sessions/${this.session._id}/update`
			var config = {
				headers: {
					Authorization: 'a1b2c3d4e5f6g7'
				}
			}
			var body = {
				updateOptions: {
					$set: {
						'stages.3.status': 'Completed',
						'stages.3.contract_status': 'Signed',
						'progress': 3
					}
				}
			}

			axios.put(requestUrl, body, config).then((response) => {
				this.$router.go(-1)
			}).catch((error) => console.log(error))
		},

		goBack () {
			this.$router.go(-1)
		}
	},

	computed: {

		...mapGetters(['session', 'user_type', 'user_object']),

		saleContractAvailable () {
			var saleContractId = this.session.stages['3'].sale_contract_id
			return (saleContractId !== '')
		},

		signedSaleContractAvailable () {
			var signedSaleContractId = this.session.stages['3'].signed_sale_contract_id
			return (signedSaleContractId !== '')
		},

		stageNotCompleted () {
			var stageStatus = this.session.stages['3'].status
			return (stageStatus !== 'Completed')
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
	row-gap: 2vmax;
	align-items: center;
}

.sdoc-status {
	grid-column: 1 / 3;
	grid-row: 1;
	width: 100%;
	height: 100%;

	display: grid;
	grid-template-columns: repeat(2, auto);
	align-items: center;
}

.bdoc-status {
	grid-column: 1 / 3;
	grid-row: 2;
	width: 100%;
	height: 100%;

	display: grid;
	grid-template-columns: repeat(2, auto);
	align-items: center;
}

.sc-contract-status {
	grid-column: 1 / 3;
	grid-row: 3;
	width: 100%;
	height: 100%;

	display: grid;
	grid-template-columns: repeat(2, auto);
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
	grid-row: 4;
	width: 100%;
	height: 100%;

	display: grid;
	grid-template-columns: repeat(3, 1fr);
	align-items: center;
	justify-items: center;
	margin-top: 3vmax;
}

.scb-button-upload {
	grid-row: 2;
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
