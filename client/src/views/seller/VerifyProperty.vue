<template>
	<v-layout column class="main-container">
		<h1
			v-if="property.verified == 0"
			class="display-3 p_text--text font-weight-bold">Property Verification</h1>

		<div
			v-if="property.verified == 2" class="pa-4 display-1 p_text--text font-weight-bold text-xs-center">
			Your property has already been verified.
		</div>

		<div class="card-container">
			<v-card
				v-if="property.verified == 1 || verificationRequested"
				class="primary p_text--text pa-4 loading-container display-1">
				<v-progress-circular
					:size="250"
					:width="10"
					color="p_green"
					indeterminate>
				</v-progress-circular>
				<div class="pa-4 headline loading-msg">
					Your property is now being verified. You may choose to wait here or proceed
					to the home screen.
				</div>
				<v-btn @click="goBack"
					color="p_text"
					outline
					class="title btnBack">
					BACK
				</v-btn>
			</v-card>
			<v-card v-if="property.verified == 0 && !verificationRequested" class="primary p_text--text pa-4 verification-card display-1">

				<div class="property-meta-container headline p_text--text">
					<div class="pa-4 p-meta-id">
						Property ID:
						<span class="p_input_text--text pa-4">
							{{ property._id }}
						</span>
					</div>
					<div class="pa-4 p-meta-name">
						Property Name:
						<span class="p_input_text--text pa-4">
							{{ property.details.name }}
						</span>
					</div>
					<div class="pa-4 p-meta-address">
						Address:
						<span class="p_input_text--text pa-4">
							{{ property.details.address.street }},
							{{ property.details.address.city }},
							{{ property.details.address.country }},
							{{ property.details.address.post_code }}
						</span>
					</div>
				</div>

				<div class="pt-4 upload-container headline">
					Please upload a copy of your title deed to continue:-
					<v-btn
						@click="$refs.fileInput.click()"
						id="btnUpload"
						color="p_blue"
						outline
						class="title">
						UPLOAD DOCUMENT
					</v-btn>
					<input
						id="input"
						v-show="false"
						ref="fileInput" type="file" @change="upload_document">

					<div class="tdh-container title">
						Your document's hash is:
						<span>
							<b class="p_green--text">
								{{ title_deed_hash }}
							</b>
						</span>
					</div>
				</div>

				<div class="pt-4 pv-button-container">
					<v-btn
						@click="goBack"
						color="p_text"
						outline
						class="title btnBack">
						BACK
					</v-btn>
					<v-btn
						@click="verifyProperty"
						color="p_purple"
						outline
						:class="{'disable-click': !documentUploaded }"
						class="title btnVerify">
						VERIFY
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
import verifier from '@/contracts/verifier'

export default {
	data () {
		return {
			title_deed_hash: '',
			property_uid: '',
			documentUploaded: false,
			verificationRequested: false,
			selected_addr: '',
			verification_transaction_receipt: ''
		}
	},
	methods: {
		get_property () {
			this.$store.dispatch('get_property_data', { property_id: this.propertyId })
		},

		async upload_document (event) {
			var files = event.target.files
			var selectedFile = files[0]
			var reader = new FileReader()

			reader.onload = async (event) => {
				let hash = await web3.utils.sha3(event.target.result)
				let propertyUid = await web3.utils.sha3(this.user_object.name + hash)

				axios.post('http://localhost:3000/api/land-registry/add-entry', {
					title_deed_hash: hash,
					owner_id: this.property.details.owner,
					property_uid: propertyUid
				}, { headers: { Authorization: 'a1b2c3d4e5f6g7' } })
					.then((response) => {
						console.log(response)
						if (response.data.error) {
							alert('Please pick a different document')
						} else if (response.data.message) {
							this.title_deed_hash = hash
							this.property_uid = propertyUid
							this.addPropertyUid(this.propertyId, propertyUid)
							this.documentUploaded = true
						}
					})
					.catch((error) => console.log(error))
			}
			reader.readAsBinaryString(selectedFile)
		},

		async addPropertyUid (propertyId, propertyUid) {
			await axios.put('http://localhost:3000/api/properties/' + propertyId + '/update',
				{ options: { 'details.property_uid': propertyUid } }, this.route_config)
		},

		async verifyProperty () {
			if (this.selected_addr !== '') {
				const body = {
					options: {
						verified: 1
					}
				}

				const bodyRevert = {
					options: {
						verified: 0
					}
				}

				await axios.put('http://localhost:3000/api/properties/' + this.propertyId + '/update', body, this.route_config)

				this.verificationRequested = true

				verifier.methods.verify(this.property_uid).send({
					from: this.selected_addr,
					gasPrice: web3.utils.toWei('42', 'gwei')
				}).then((receipt) => {
					this.verification_tx_receipt = receipt
				}).catch(async (error) => {
					console.log(error)
					await axios.put('http://localhost:3000/api/properties/' + this.propertyId + '/update', bodyRevert, this.route_config)
					this.verificationRequested = false
				})
			} else {
				alert('Please login to metamask to continue.')
			}
		},

		goBack () {
			this.$router.push('/seller/properties/' + this.propertyId)
		},
		async load_accounts () {
			if (window.ethereum !== 'undefined') {
				let addresses = await window.ethereum.enable()
				this.selected_addr = addresses[0]
				console.log(addresses)
			} else {
				alert('Please download and install the Metamask browser addon to continue')
			}
		}
	},
	computed: {
		...mapGetters([
			'property',
			'user_id',
			'route_config',
			'user_object'
		]),
		propertyId () {
			return this.$route.params.property_id
		}
	},
	mounted () {
		this.load_accounts()
		this.get_property()
	}
}
</script>

<style>

.main-container {
	display: grid;
	grid-template-columns: repeat(1, 1fr);
	justify-items: center;
	align-items: center;
	overflow-wrap: break-word;
	word-wrap: break-word;
	hyphens: auto;
	height: 100vh;
}

.card-container {
	width: 90%;
}

	.verification-card {
		border-radius: 25px;
		display: grid;
		grid-template-rows: repeat(3, 25vh);
		align-items: center;
		justify-items: center;
	}

.upload-container {
	display: flex;
	grid-row: 2;
	flex-direction: column;
	justify-items: center;
	align-items: center;
	padding: 10px;
	flex-wrap: wrap
}

	#btnUpload {
		width: 50%;
		height: 10vh;
		border-radius: 15px;
		margin: 25px;
	}

.property-meta-container {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-template-rows: repeat(2, auto);
	align-items: center;
	justify-items: center;
}

.p-meta-address {
	grid-column: 1 / 3;
	grid-row: 2;
}

.pv-button-container {
	grid-row: 3 / 4;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	border-radius: 20px;
	width: 100%;
}

.btnBack {
	height: 10vh;
	border-radius: 10px;
}

.btnVerify {
	height: 10vh;
	border-radius: 10px;
}

.disable-click {
	pointer-events: none;
	opacity: 0.5;
}

.loading-container {
	display: grid;
	align-items: center;
	justify-items: center;
}

	.loading-msg {
		text-align: center;
	}

</style>
