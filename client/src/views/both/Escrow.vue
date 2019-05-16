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
					v-if="user_type == 'seller' && status('ms1') == 'ASD'"
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
					v-if="user_type == 'seller' && status('ms1') == 'ASD'"
					@click="createEscrow"
					outline
					color="p_blue"
					class="title ec-button">
					CREATE ESCROW
				</v-btn>

			</v-card>

			<v-card
				v-if="activeMiniStage == 2"
				class="primary p_text--text pa-4 ec-ms2-card display-1">
				Mini stage 2
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

import escrow from '@/contracts/escrow'
import escrowFactory from '@/contracts/escrowFactory'

export default {

	data () {
		return {
			ttdHash: '',
			selectedAddr: ''
		}
	},

	methods: {

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

		async createEscrow () {
			if (this.selectedAddr !== '') {
				if (this.selectedAddr === this.user_object.account_address) {
					let sessionIdHash = await web3.utils.sha3(this.session._id)
					escrowFactory.methods.open_escrow(this.ttdHash, sessionIdHash).send({
						from: this.selectedAddr,
						gasPrice: web3.utils.toWei('42', 'gwei')
					}).on('confirmation', (confirmationNumber, receipt) => {
						this.$router.go(-1)
					}).catch((error) => console.log(error))
				} else {
					alert('Please switch accounts to the one you used during registration')
				}
			} else {
				alert('Please login to metamask to continue')
			}
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

		status (miniStageNumber) {
			return this.session.stages['4'].mini_stages['1'].status
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

		...mapGetters(['session', 'user_type', 'user_object']),

		activeMiniStage () {
			return this.session.stages['4'].active_mini_stage
		}
	},

	mounted () {
		this.load_accounts()
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
