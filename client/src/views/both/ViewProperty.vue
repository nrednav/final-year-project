<template>
	<v-layout column>
		<v-container class="vp-panel white--text">

			<v-card class="vp-property-details primary">
				<div class="vp-details">
					<div
						class="vp-property-name pa-4 title p_input_text--text p_input">
						<span class="p_text--text pr-4">Property Name: </span>
						{{ property.details.name }}
					</div>
					<div
						class="street pa-4 title p_input_text--text p_input">
						<span class="p_text--text pr-4">Street: </span>
						{{ property.details.address.street }}
					</div>
					<div
						class="city pa-4 title p_input_text--text p_input">
						<span class="p_text--text pr-4">City: </span>
						{{ property.details.address.city }}
					</div>
					<div
						class="country pa-4 title p_input_text--text p_input">
						<span class="p_text--text pr-4">Country: </span>
						{{ property.details.address.country }}
					</div>
					<div
						class="post-code pa-4 title p_input_text--text p_input">
						<span class="p_text--text pr-4">Post Code: </span>
						{{ property.details.address.post_code }}
					</div>
					<div
						class="property-type pa-4 title p_input_text--text p_input">
						<span class="p_text--text pr-4">Type: </span>
						{{ property.details.type }}
					</div>
					<div
						class="p-size pa-4 title p_input_text--text p_input">
						<span class="p_text--text pr-4">Size: </span>
						{{ property.details.size }}
					</div>
					<div
						class="bed-count pa-4 title p_input_text--text p_input">
						<span class="p_text--text pr-4">Bedroom Count: </span>
						{{ property.details.bedroom_count }}
					</div>
					<div
						class="bath-count pa-4 title p_input_text--text p_input">
						<span class="p_text--text pr-4">Bathroom Count: </span>
						{{ property.details.bathroom_count }}
					</div>
				</div>
			</v-card>

			<v-card class="pd2 primary">
				<div class="details-2">
					<div
						class="p-price pa-4 title p_input_text--text p_input">
						<span class="p_text--text pr-4">Price: </span>
						{{ property.details.listing_price }}
					</div>
					<div
						class="p-deposit pa-4 title p_input_text--text p_input">
						<span class="p_text--text pr-4">Deposit: </span>
						{{ property.details.deposit }}
					</div>
					<div
						class="p-available-from pa-4 title p_input_text--text p_input">
						<span class="p_text--text pr-4">Available From: </span>
						{{ property.details.available_from.substr(0,7) }}
					</div>
				</div>
			</v-card>

			<v-card class="image-upload-container primary">
				<div class="vp-upload-panel p_text--text text-xs-center display-1">
					Property Images
				</div>
			</v-card>

			<v-card class="vp-property-description primary">
				<div
					class="vp-description pa-4 title p_input_text--text p_input">
					<span class="p_text--text pr-4">Description: </span>
					{{ property.details.description }}
				</div>
			</v-card>

			<div class="vp-button_container" v-if="user_type == 'seller'">

				<v-btn
					v-if="property.verified == 0"
					id="btnVerify"
					@click="verifyProperty"
					outline
					color="p_purple"
					class="title button">VERIFY</v-btn>

				<v-btn
					v-if="property.verified == 1"
					id="btnVerify"
					outline
					color="p_purple"
					class="title button">VERIFYING</v-btn>

				<v-btn
					v-if="property.verified == 2"
					outline
					color="p_purple"
					class="title button">
					<v-icon class="pr-4 p_green--text">fas fa-check-circle</v-icon>
					VERIFIED
				</v-btn>

				<v-btn
					v-if="!property.listed"
					id="btnList"
					@click="listProperty"
					outline
					color="p_blue"
					:class="{'disable-click': property.verified == 0 || property.verified == 1}"
					class="title button">LIST</v-btn>

				<v-btn
					v-if="property.listed"
					id="btnUnlist"
					@click="unlistProperty"
					outline color="p_orange" class="title button">UNLIST</v-btn>

				<v-btn
					id="btnBack"
					@click="back" outline color="p_text" class="title button">
					BACK</v-btn>

				<v-btn
					id="btnRemove"
					@click="removeProperty" outline color="p_red" class="title button">
					REMOVE PROPERTY</v-btn>

			</div>

			<div class="vp-button_container" v-if="user_type == 'buyer'">

				<v-btn
					id="btnBack"
					@click="back" outline color="p_text" class="title button">
					BACK</v-btn>

				<div class="offer-dialog-container">
					<OfferPopup />
				</div>

			</div>

			<div
				v-if="user_type == 'seller'"
				class="offers-container">
				<h1 class="p_text--text">Offers</h1>
				<OfferList :offers="property.offers" :propertyId="propertyId" :property="property"/>
			</div>

		</v-container>
	</v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'

import OfferPopup from '@/views/buyer/OfferPopup'
import OfferList from '@/views/seller/OfferList'

export default {
	components: {
		OfferPopup,
		OfferList
	},
	data () {
		return {
			property: null
		}
	},
	methods: {
		async get_property () {
			const response = await axios.get('http://localhost:3000/api/properties/' + this.propertyId, this.route_config)
			this.property = response.data.result
		},

		verifyProperty () {
			this.$router.push('/seller/properties/' + this.propertyId + '/verify')
		},

		async listProperty () {
			await axios.put('http://localhost:3000/api/properties/' + this.propertyId + '/list', { listed: true, user_id: this.user_id }, this.route_config)
			this.$router.push('/seller/properties')
		},

		async unlistProperty () {
			if (this.property.offers.length > 0) {
				alert('There are currently offers made on this property, please reject them first before unlisting this property')
			} else {
				await axios.put('http://localhost:3000/api/properties/' + this.propertyId + '/list', { listed: false, user_id: this.user_id }, this.route_config)
				this.$router.push('/seller/properties')
			}
		},

		async removeProperty () {
			await axios.delete('http://localhost:3000/api/properties/delete/' + this.propertyId, this.route_config)
			await axios.put('http://localhost:3000/api/users/' + this.property.details.owner + '/remove/' + this.propertyId, { id: this.propertyId }, this.route_config)
			this.$router.push('/seller/properties')
		},

		back () {
			if (this.user_type === 'buyer') {
				this.$router.go(-1)
			} else if (this.user_type === 'seller') {
				this.$router.push('/seller/properties')
			}
		}
	},
	computed: {
		propertyId () {
			return this.$route.params.property_id
		},
		...mapGetters(['route_config', 'user_id', 'user_type'])
	},
	mounted () {
		this.get_property()
	}
}
</script>

<style>
.vp-panel {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-template-rows: repeat(4, minmax(20vh, auto));
	grid-gap: 50px;
	max-width: 100vw;
}

.vp-property-details {
	grid-row: 1 / 3;
	grid-column: 1 / 2;
	border-radius: 20px;
	overflow-wrap: break-word;
	word-wrap: break-word;
	hyphens: auto;
}

	.vp-details {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		grid-template-rows: repeat(5, minmax(10vh, auto));
		grid-gap: 20px;
		padding: 2vw;
	}

	.vp-property-name {
		grid-column: 1 / 3;
		grid-row: 1;
		padding: 10px;
		border-radius: 25px;
	}

	.street {
		grid-column: 1 / 2;
		grid-row: 2;
		padding: 10px;
		border-radius: 25px;
		overflow-wrap: break-word;
		word-wrap: break-word;
		hyphens: auto;
	}

	.city {
		grid-column: 2 / 3;
		grid-row: 2;
		padding: 10px;
		border-radius: 25px;
	}

	.country {
		grid-column: 1 / 2;
		grid-row: 3;
		padding: 10px;
		border-radius: 25px;
	}

	.post-code {
		grid-column: 2 / 3;
		grid-row: 3;
		padding: 10px;
		border-radius: 25px;
	}

	.property-type {
		grid-column: 1 / 2;
		grid-row: 4;
		border-radius: 25px;
		padding: 10px;
	}

	.property-type option {
		background-color: #1e232a;
	}

	.p-size {
		grid-column: 2 / 3;
		grid-row: 4;
		border-radius: 25px;
		padding: 10px;
	}

	.bed-count {
		grid-column: 1 / 2;
		grid-row: 5;
		border-radius: 25px;
		padding: 10px;
	}

	.bath-count {
		grid-column: 2 / 3;
		grid-row: 5;
		border-radius: 25px;
		padding: 10px;
	}

.pd2 {
	grid-row: 1;
	grid-column: 2;
	border-radius: 20px;
	overflow-wrap: break-word;
	word-wrap: break-word;
	hyphens: auto;
}

	.details-2 {
		grid-column: 1;
		grid-row: 1;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-template-rows: repeat(2, minmax(10vh, auto));
		grid-gap: 20px;
		padding: 2vw;
		max-width: 100%;
	}

	.p-price {
		grid-column: 1 / 2;
		grid-row: 1;
		border-radius: 25px;
		padding: 10px;
	}

	.p-deposit {
		grid-column: 2 / 3;
		grid-row: 1;
		border-radius: 25px;
		padding: 10px;
	}

	.p-available-from {
		grid-column: 1 / 3;
		grid-row: 2;
		border-radius: 25px;
		padding: 10px;
	}

.vp-property-description {
	display: grid;
	grid-template-columns: repeat(1, 1fr);
	grid-row: 3 / 5;
	padding: 20px;
	border-radius: 20px;
	overflow-wrap: break-word;
	word-wrap: break-word;
	hyphens: auto;
}

	.vp-property-description vp-description {
		border-radius: 20px;
	}

.image-upload-container {
	display: grid;
	grid-template-columns: repeat(1, 1fr);
	grid-template-rows: repeat(1, auto);
	grid-row: 2 / 4;
	padding: 20px;
	border-radius: 20px;
}

.vp-upload-panel {
	grid-row: 1;
	grid-column: 1;
	display: grid;
	grid-template-columns: repeat(1, 1fr);
	grid-template-rows: repeat(1, auto);
	width: 100%;
	height: 100%;
}

.vp-button_container {
	grid-row: 4 / 5;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-template-rows: repeat(2, 15vh);
	align-items: center;
	border-radius: 20px;
}

.button {
	border-radius: 10px;
	width: 20vw;
	height: 10vh;
}

.v-chip {
	white-space: normal;
	flex-wrap: wrap;
}

.disable-click {
	pointer-events: none;
	opacity: 0.5;
}

.offers-container {
	grid-row: 5;
	grid-column: 1 / 3;
}

</style>
