<template>
	<v-layout column class="main-ec-container">

		<h1 class="display-3 p_text--text font-weight-bold">
			Stage 4: Escrow
		</h1>

		<div class="ec-card-container">

			<v-card
				v-if="activeMiniStage == 1"
				class="primary p_text--text pa-4 ec-ms1-card display-1">

				<div
					v-if="user_type == 'seller' && miniStageStatus(1) == 'ASD'"
					class="pa-4 headline title-transfer-info">
					Please upload your title transfer document:
				</div>

				<div
					class="pa-4 headline ec-ttdu-status">
					Title transfer document submission status:
				</div>
				<div class="pa-4 headline ec-ttdu-status-value p_yellow--text">
					{{ session.stages['4'].mini_stages['1'].seller_deposit_status }}
				</div>

				<div class="ec-ttd-hash-info">
					<div
						class="pa-4 headline ec-ttd-hash">
						Title transfer document hash:
					</div>
					<div class="pa-4 headline ec-ttdh-value p_yellow--text">
						{{ session.stages['4'].mini_stages['1'].title_transfer_document_hash }}
					</div>
				</div>

				<div
					class="pa-4 headline ec-status">
					Status:
				</div>
				<div class="pa-4 headline ec-status-value p_yellow--text">
					{{ session.stages['4'].mini_stages['1'].status }}
				</div>

				<div
					class="pa-4 headline ec-bp-status">
					Buyer payment status:
				</div>
				<div class="pa-4 headline ec-bp-status-value p_yellow--text">
					{{ session.stages['4'].mini_stages['1'].buyer_deposit_status }}
				</div>

				<v-btn
					v-if="user_type == 'seller' && miniStageStatus(1) == 'ASD'"
					@click="$refs.ecFileInput.click()"
					outline
					color="p_purple"
					:class="{'disable-click': decisionMade}"
					class="title ec-button upload-ttd-btn">
					UPLOAD DOCUMENT
				</v-btn>
				<input
					id="input"
					v-show="false"
					ref="ecFileInput" type="file" @change="uploadTTD">

				<v-btn
					v-if="user_type == 'seller' && miniStageStatus(1) == 'ASD' && ttdUploaded"
					@click="createEscrow"
					outline
					color="p_blue"
					:class="{'disable-click': decisionMade}"
					class="title ec-button create-escrow-btn">
					CREATE ESCROW
				</v-btn>

				<v-btn
					v-if="user_type == 'buyer' && miniStageStatus(1) == 'ABD'"
					@click="downloadDocument('ttd')"
					outline
					color="p_orange"
					class="title ec-button download-ttd-btn">
					DOWNLOAD
				</v-btn>

				<v-btn
					v-if="user_type == 'buyer' && miniStageStatus(1) == 'ABD' && downloadClicked"
					@click="acceptTTD"
					outline
					color="p_blue"
					:class="{'disable-click': decisionMade}"
					class="title ec-button accept-ttd-btn">
					ACCEPT
				</v-btn>

				<v-btn
					v-if="user_type == 'buyer' && miniStageStatus(1) == 'ABD' && downloadClicked"
					outline
					color="p_red"
					:class="{'disable-click': true}"
					class="title ec-button reject-ttd-btn">
					REJECT
				</v-btn>

				<v-btn
					v-if="user_type == 'seller' && miniStageStatus(1) == 'ATTR'"
					@click="requestTitleTransfer"
					outline
					color="p_blue"
					:class="{'disable-click': decisionMade}"
					class="title ec-button ec-request-tt-btn">
					REQUEST TITLE TRANSFER
				</v-btn>

			</v-card>

			<v-card
				v-if="activeMiniStage == 2"
				class="primary p_yellow--text pa-4 text-xs-center ec-ms2-card display-1">
				TRANSFER IN PROGRESS
				<v-progress-circular
					:size="100"
					:width="10"
					color="p_green"
					indeterminate>
				</v-progress-circular>
			</v-card>

			<v-card
				v-if="activeMiniStage == 3"
				class="primary p_text--text pa-4 ec-ms3-card display-1">

				<div
					v-if="miniStageStatus(3) != 'Pending'"
					class="pa-4 headline tdd-info">
					Please review the draft title deed and submit your decision.
				</div>

				<v-btn
					v-if="miniStageStatus(3) != 'Pending'"
					@click="downloadDocument('tdd')"
					outline
					color="p_orange"
					class="title ec-button download-tdd-btn">
					DOWNLOAD
				</v-btn>

				<v-btn
					v-if="miniStageStatus(3) != 'Pending' && downloadClicked"
					@click="acceptTDD"
					outline
					color="p_blue"
					:class="{'disable-click': decisionMade}"
					class="title ec-button accept-tdd-btn">
					ACCEPT
				</v-btn>

				<v-btn
					v-if="miniStageStatus(3) != 'Pending' && downloadClicked"
					outline
					color="p_red"
					:class="{'disable-click': true}"
					class="title ec-button reject-tdd-btn">
					REJECT
				</v-btn>

			</v-card>

			<v-card
				v-if="activeMiniStage == 4"
				class="primary p_text--text pa-4 ec-ms4-card display-1">

				<div class="ec-finish-date headline">
					Finish date:
				</div>
				<div class="ec-finish-date-value headline p_yellow--text">
					{{ session.stages['4'].mini_stages['4'].finished_at }}
				</div>

				<div
					v-if="user_type == 'buyer' && miniStageStatus(4) == 'Completed'"
					class="download-tdo-info headline">
					Final title deed copy:
				</div>

				<v-btn
					v-if="user_type == 'buyer' && miniStageStatus(4) == 'Completed'"
					@click="downloadDocument('tdo')"
					outline
					color="p_orange"
					class="title ec-button download-tdo-btn">
					DOWNLOAD
				</v-btn>

			</v-card>

			<v-btn
				@click="goBack"
				outline
				color="p_text"
				class="title ec-button ec-button-back">
				BACK
			</v-btn>

		</div>

	</v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
import web3 from '@/web3'
import FileSaver from 'file-saver'

import escrow from '@/contracts/escrow'
import escrowFactory from '@/contracts/escrowFactory'

export default {

	data () {
		return {
			ttdHash: '',
			ttdUploaded: false,
			selectedAddr: '',
			downloadClicked: false,
			decisionMade: false
		}
	},

	methods: {

		get_property () {
			this.$store.dispatch('get_property_data', { property_id: this.session.property_id })
		},

		uploadTTD (event) {
			console.log('file uploaded')
			var files = event.target.files
			var selectedFile = files[0]
			var reader = new FileReader()

			reader.onload = async (event) => {
				let ttdHash = await web3.utils.sha3(event.target.result)
				this.ttdUploaded = true
				var requestUrl = `http://localhost:3000/api/sessions/${this.session._id}/upload-ttd`
				var config = { headers: { Authorization: 'a1b2c3d4e5f6g7' } }

				var formData = new FormData()
				formData.append('file', selectedFile)
				formData.append('ttdHash', ttdHash)

				axios.post(requestUrl, formData, config).then((response) => {
					console.log(response)
				}).catch((error) => console.log(error))
				this.ttdHash = ttdHash
			}
			reader.readAsBinaryString(selectedFile)
		},

		downloadDocument (docType) {
			let requestUrl = `http://localhost:3000/api/sessions/${this.session._id}/title-deed/${docType}`
			let config = {
				headers: {
					Authorization: 'a1b2c3d4e5f6g7'
				},
				responseType: 'blob'
			}

			axios.get(requestUrl, config).then((response) => {
				console.log(response)
				this.downloadClicked = true
				let fileType = response.headers['content-type']
				let fileName

				if (docType === 'ttd') {
					fileName = 'title-transfer-document'
				} else if (docType === 'tdd') {
					fileName = 'title-deed-draft.pdf'
				} else if (docType === 'tdo') {
					fileName = 'title-deed.pdf'
				}

				FileSaver.saveAs(response.data, fileName, { type: fileType })
			}).catch((error) => console.log(error))
		},

		async acceptTTD () {
			this.decisionMade = true
			let ttdHash = this.session.stages['4'].mini_stages['1'].title_transfer_document_hash
			let price = this.property.details.listing_price / 1000
			let sessionIdHash = await web3.utils.sha3(this.session._id)
			escrow.address = await escrowFactory.methods.get_escrow(sessionIdHash).call()
			console.log(escrow.address)

			escrow.methods.deposit(ttdHash).send({
				from: this.selectedAddr,
				value: web3.utils.toWei(price.toString(), 'ether')
			}).once('confirmation', (confirmationNumber, receipt) => {
				console.log(receipt)
				this.$router.push('/buyer/sessions/')
			}).catch((error) => {
				console.log(error)
				this.decisionMade = false
			})
		},

		async acceptTDD () {
			this.decisionMade = true
			let requestUrl = `http://localhost:3000/api/sessions/${this.session._id}/title-deed/tdd`
			let config = { headers: { Authorization: 'a1b2c3d4e5f6g7' } }
			axios.get(requestUrl, config).then(async (response) => {
				let titleDraftHash = await web3.utils.sha3(response.data)
				let sessionIdHash = await web3.utils.sha3(this.session._id)
				escrow.address = await escrowFactory.methods.get_escrow(sessionIdHash).call()

				escrow.methods.title_draft_greenlight(titleDraftHash, true).send({
					from: this.selectedAddr
				}).once('confirmation', (cn, receipt) => {
					console.log(receipt)
					let updateOptions = {
						$set: {
							'stages.4.mini_stages.3.status': 'ADG'
						}
					}
					this.updateSession(updateOptions, true)
				}).catch((error) => {
					console.log(error)
					this.decisionMade = false
				})
			}).catch((error) => {
				console.log(error)
				this.decisionMade = false
			})
		},

		async createEscrow () {
			this.decisionMade = true
			if (this.selectedAddr !== '') {
				if (this.selectedAddr === this.user_object.account_address) {
					let sessionIdHash = await web3.utils.sha3(this.session._id)
					escrowFactory.methods.open_escrow(this.ttdHash, sessionIdHash).send({
						from: this.selectedAddr,
						gasPrice: web3.utils.toWei('42', 'gwei')
					}).once('confirmation', (confirmationNumber, receipt) => {
						this.$router.push('/seller/sessions/')
					}).catch((error) => {
						console.log(error)
						this.decisionMade = false
					})
				} else {
					alert('Please switch accounts to the one you used during registration')
					this.decisionMade = false
				}
			} else {
				alert('Please login to metamask to continue')
				this.decisionMade = false
			}
		},

		async requestTitleTransfer () {
			this.decisionMade = true
			let updateOptions = {
				$set: {
					'stages.4.mini_stages.1.status': 'Completed',
					'stages.4.active_mini_stage': 2,
					'stages.4.mini_stages.2.status': 'In Progress'
				}
			}

			let sessionIdHash = await web3.utils.sha3(this.session._id)
			escrow.address = await escrowFactory.methods.get_escrow(sessionIdHash).call()
			escrow.methods.request_title_transfer().send({
				from: this.selectedAddr
			}).once('confirmation', (confirmationNumber, receipt) => {
				console.log(receipt)
			}).catch((error) => {
				console.log(error)
				this.decisionMade = false
			})

			this.updateSession(updateOptions, false)
		},

		updateSession (updateOptions, redirect) {
			var requestUrl = `http://localhost:3000/api/sessions/${this.session._id}/update`
			var config = { headers: { Authorization: 'a1b2c3d4e5f6g7' } }
			var body = {
				updateOptions
			}

			axios.put(requestUrl, body, config).then((response) => {
				console.log(response)
				if (redirect) {
					this.$router.push(`/${this.user_type}/sessions`)
				}
			}).catch((error) => console.log(error))
		},

		miniStageStatus (stageNumber) {
			return this.session.stages['4'].mini_stages[`${stageNumber}`].status
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

		...mapGetters(['session', 'user_type', 'user_object', 'property']),

		activeMiniStage () {
			return this.session.stages['4'].active_mini_stage
		}
	},

	mounted () {
		this.load_accounts()
		this.get_property()
	}
}
</script>

<style>

.main-ec-container {
	display: grid;
	grid-template-columns: repeat(1, 1fr);
	justify-items: center;
	align-items: center;
	overflow-wrap: break-word;
	word-wrap: break-word;
	hyphens: auto;
}

.ec-card-container {
	margin-top: 10vh;
	width: 90%;
}

.ec-ms1-card {
	border-radius: 25px;
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	grid-template-rows: repeat(4, minmax(1fr, auto));
	grid-gap: 2vmax;
}

	.title-transfer-info {
		grid-column: 1 / 4;
		grid-row: 1;
	}

	.upload-ttd-btn {
		grid-column: 4;
		grid-row: 1;
	}

	.download-ttd-btn {
		grid-column: 4;
		grid-row: 2;
	}

	.accept-ttd-btn {
		grid-column: 4;
		grid-row: 4;
	}

	.reject-ttd-btn {
		grid-column: 4;
		grid-row: 5;
	}

	.create-escrow-btn {
		grid-column: 4;
		grid-row: 2;
	}

	.ec-status {
		grid-column: 1;
		grid-row: 4;
	}

	.ec-status-value {
		grid-column: 3;
		grid-row: 4;
	}

	.ec-ttdu-status {
		grid-column: 1 / 3;
		grid-row: 2;
	}

	.ec-ttdu-status-value {
		grid-column: 3;
		grid-row: 2;
	}

	.ec-ttd-hash-info {
		grid-column: 1 / 3;
		grid-row: 3;
		display: grid;
		grid-template-rows: repeat(2, minmax(1fr, auto));
	}

		.ec-ttd-hash {
			grid-row: 1;
		}

		.ec-ttdh-value {
			grid-column: 1;
			grid-row: 2;
		}

	.ec-bp-status {
		grid-column: 1 / 3;
		grid-row: 5;
	}

	.ec-bp-status-value {
		grid-column: 3;
		grid-row: 5;
	}

	.ec-request-tt-btn {
		grid-column: 4;
		grid-row: 2;
	}

.ec-ms2-card {
	border-radius: 25px;
}

.ec-ms3-card {
	border-radius: 25px;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-template-rows: repeat(2, minmax(1fr, auto));
	grid-gap: 2vmax;
}

	.tdd-info {
		grid-column: 1 / 3;
		grid-row: 1;
	}

	.download-tdd-btn {
		grid-column: 3;
		grid-row: 1;
	}

	.accept-tdd-btn {
		grid-column: 3;
		grid-row: 2;
	}

	.reject-tdd-btn {
		grid-column: 2;
		grid-row: 2;
	}

.ec-ms4-card {
	border-radius: 25px;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-template-rows: repeat(2, minmax(1fr, auto));
	grid-gap: 2vmax;
	justify-items: center;
	align-items: center;
}

	.ec-finish-date {
		grid-column: 1;
		grid-row: 1;
	}

	.ec-finish-date-value {
		grid-column: 2;
		grid-row: 1;
	}

	.download-tdo-info {
		grid-column: 1;
		grid-row: 2;
	}

	.download-tdo-btn {
		grid-column: 2;
		grid-row: 2;
	}

.ec-button {
	height: 10vh;
	width: 25vw;
	border-radius: 10px;
}

.ec-button-back {
	margin-top: 2vmax;
}

.disable-click {
	pointer-events: none;
	opacity: 0.5;
}

</style>
