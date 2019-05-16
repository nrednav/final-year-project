<template>
	<v-layout column class="main-ec-container">

		<h1 class="display-3 p_text--text font-weight-bold">
			Stage 4: Escrow
		</h1>

		<div class="ec-card-container">

			<v-card
				v-if="activeMiniStage == 1"
				class="primary p_text--text pa-4 ec-ms1-card display-1">

				<v-btn
					v-if="user_type == 'seller' && miniStageStatus(1) == 'ASD'"
					@click="$refs.ecFileInput.click()"
					outline
					color="p_purple"
					class="title ec-button">
					UPLOAD DOCUMENT
				</v-btn>
				<input
					id="input"
					v-show="false"
					ref="ecFileInput" type="file" @change="uploadTTD">

				<v-btn
					v-if="user_type == 'buyer' && miniStageStatus(1) == 'ABD'"
					@click="downloadDocument('ttd')"
					outline
					color="p_orange"
					class="title ec-button">
					DOWNLOAD
				</v-btn>

				<v-btn
					v-if="user_type == 'seller' && miniStageStatus(1) == 'ASD'"
					@click="createEscrow"
					outline
					color="p_blue"
					class="title ec-button">
					CREATE ESCROW
				</v-btn>

				<v-btn
					v-if="user_type == 'buyer' && miniStageStatus(1) == 'ABD' && downloadClicked"
					@click="acceptTTD"
					outline
					color="p_blue"
					class="title ec-button">
					ACCEPT
				</v-btn>

				<v-btn
					v-if="user_type == 'buyer' && miniStageStatus(1) == 'ABD' && downloadClicked"
					outline
					color="p_red"
					class="title ec-button">
					REJECT
				</v-btn>

				<v-btn
					v-if="user_type == 'seller' && miniStageStatus(1) == 'ATTR'"
					@click="requestTitleTransfer"
					outline
					color="p_blue"
					class="title ec-button">
					REQUEST TITLE TRANSFER
				</v-btn>

			</v-card>

			<v-card
				v-if="activeMiniStage == 2"
				class="primary p_text--text pa-4 ec-ms2-card display-1">
			</v-card>

			<v-card
				v-if="activeMiniStage == 3"
				class="primary p_text--text pa-4 ec-ms3-card display-1">
				Mini stage 3
			</v-card>

			<v-card
				v-if="activeMiniStage == 4"
				class="primary p_text--text pa-4 ec-ms4-card display-1">
				Mini stage 4
			</v-card>

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
			selectedAddr: '',
			downloadClicked: false
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
					fileName = 'title-deed-draft'
				} else if (docType === 'tdo') {
					fileName = 'title-deed'
				}

				FileSaver.saveAs(response.data, fileName, { type: fileType })
			}).catch((error) => console.log(error))
		},

		async acceptTTD () {
			let ttdHash = this.session.stages['4'].mini_stages['1'].title_transfer_document_hash
			let price = this.property.details.listing_price / 1000
			let sessionIdHash = await web3.utils.sha3(this.session._id)
			let escrowContractAddress = await escrowFactory.methods.get_escrow(sessionIdHash).call()
			escrow.address = escrowContractAddress

			escrow.methods.deposit(ttdHash).send({
				from: this.selectedAddr,
				value: web3.utils.toWei(price.toString(), 'ether')
			}).on('confirmation', (confirmationNumber, receipt) => {
				console.log(receipt)
				this.$router.push('/buyer/sessions/' + this.session._id)
			}).catch((error) => console.log(error))
		},

		async createEscrow () {
			if (this.selectedAddr !== '') {
				if (this.selectedAddr === this.user_object.account_address) {
					let sessionIdHash = await web3.utils.sha3(this.session._id)
					escrowFactory.methods.open_escrow(this.ttdHash, sessionIdHash).send({
						from: this.selectedAddr,
						gasPrice: web3.utils.toWei('42', 'gwei')
					}).on('confirmation', (confirmationNumber, receipt) => {
						this.$router.push(`/seller/sessions/${this.session._id}`)
					}).catch((error) => console.log(error))
				} else {
					alert('Please switch accounts to the one you used during registration')
				}
			} else {
				alert('Please login to metamask to continue')
			}
		},

		async requestTitleTransfer () {
			let updateOptions = {
				$set: {
					'stages.4.mini_stages.1.status': 'Completed',
					'active_mini_stage': 2,
					'stages.4.mini_stages.2.status': 'In Progress'
				}
			}
			this.updateSession(updateOptions)

			let sessionIdHash = await web3.utils.sha3(this.session._id)
			escrow.address = await escrowFactory.methods.get_escrow(sessionIdHash).call()
			escrow.methods.request_title_transfer().send({
				from: this.selectedAddr
			}).once('confirmation', (confirmationNumber, receipt) => {
				console.log(receipt)
			}).catch((error) => console.log(error))
		},

		updateSession (updateOptions) {
			var requestUrl = `http://localhost:3000/api/sessions/${this.session._id}/update`
			var config = { headers: { Authorization: 'a1b2c3d4e5f6g7' } }
			var body = {
				updateOptions
			}

			axios.put(requestUrl, body, config).then((response) => {
				console.log(response)
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

.ec-card {
	border-radius: 25px;
}

.ec-button {
	height: 10vh;
	width: 25vw;
	border-radius: 10px;
}

</style>
