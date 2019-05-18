<template>
	<div class="offer-list-container">
		<v-container>

			<div v-if="property.session_underway || decisionMade"
				class="pa-4 display-1 p_yellow--text font-weight-bold text-xs-center">
				Session in progress
			</div>

			<v-card
				v-for="(offer, index) in offers"
				:key="index"
				class="pa-4 primary list-offer-card">

				<div class="bidder-name-label title p_text--text font-weight-bold">
					Bidder's Name</div>

				<div class="bidder-name title p_input_text--text font-weight-bold">
					{{ offer.buyer_name }}</div>

				<div class="bidder-price-label title p_text--text font-weight-bold">
					Offer</div>

				<div class="bidder-price title p_input_text--text font-weight-bold">
					{{ offer.price }}</div>

				<v-btn
					outline
					:class="{'disable-click': property.session_underway || decisionMade}"
					@click="acceptOffer(index, offer._id, offer.buyer_id, offer.buyer_account_address)"
					color="p_green"
					class="title accept-offer-btn">
					Accept
				</v-btn>

				<v-btn
					outline
					:class="{'disable-click': property.session_underway || decisionMade}"
					@click="rejectOffer(index, offer._id)"
					color="p_red"
					class="title reject-offer-btn">
					Reject
				</v-btn>

			</v-card>
		</v-container>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'

const apiUrl = 'http://localhost:3000/api/properties/'

export default {
	data () {
		return {
			decisionMade: false
		}
	},
	props: ['offers', 'propertyId', 'property'],

	methods: {

		async acceptOffer (index, offerId, buyerId, buyerAddress) {
			var duplicateSession = await this.isDuplicateSession(this.user_id, buyerId)

			if (!duplicateSession) {
				var sellerId = this.user_id
				var sellerAddress = this.user_object.account_address
				var listingPrice = this.property.details.listing_price

				var body = {
					offerId,
					buyerId,
					buyerAddress,
					sellerId,
					sellerAddress,
					listingPrice
				}

				axios.post(apiUrl + this.propertyId + '/offers/accept', body,
					this.route_config).then((response) => {
					this.removeOfferFromList(index)
					this.decisionMade = true
				}).catch((error) => console.log(error))
			} else {
				alert('There is/has been a session underway between you and bidder')
			}
		},

		async isDuplicateSession (sellerId, buyerId) {
			let requestUrl = 'http://localhost:3000/api/sessions/exists'
			let config = {
				headers: {
					Authorization: 'a1b2c3d4e5f6g7'
				},
				params: {
					sellerId: sellerId,
					buyerId: buyerId
				}
			}

			let response = await axios.get(requestUrl, config)
			return response.data.exists
		},

		rejectOffer (index, offerId) {
			axios.post(apiUrl + this.propertyId + '/offers/reject', { offerId },
				this.route_config).then((response) => {
				this.removeOfferFromList(index)
				console.log(response)
			})
				.catch((error) => console.log(error))
		},

		removeOfferFromList (index) {
			this.offers.splice(index)
		}
	},

	computed: {
		...mapGetters(['route_config', 'user_id', 'user_object'])
	}
}
</script>

<style>

.list-offer-card {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	grid-template-rows: repeat(2, 1fr);
	grid-gap: 2vw;
	margin: 3vh;
	justify-items: start;
	align-items: center;
	border-radius: 25px;
}

.bidder-name-label {
	grid-column: 1 / 2;
}

.bidder-price-label {
	grid-column: 2 / 3;
}

.bidder-name {
	grid-column: 1 / 2;
	grid-row: 2;
}

.bidder-price {
	grid-column: 2 / 3;
	grid-row: 2;
}

.accept-offer-btn {
	grid-column: 3 / 4;
	grid-row: 1 / 3;
	border-radius: 10px;
	height: 10vh;
	width: 100%;
}

.reject-offer-btn {
	grid-column: 4 / 4;
	grid-row: 1 / 3;
	border-radius: 10px;
	height: 10vh;
	width: 100%;
}

</style>
