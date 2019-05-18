<template>

	<v-dialog v-model="dialog" class="offer-dialog">
		<v-btn
			v-if="!offerSubmitted"
			slot="activator"
			outline
			color="p_blue"
			class="title button">SUBMIT OFFER</v-btn>

		<v-card class="pa-4 primary p_text--text display-1 submit-offer-card">
			<v-btn
				id="btnSubmitOffer"
				@click="submitOffer"
				outline
				color="p_green"
				class="title button">
				SUBMIT
			</v-btn>
			<v-btn
				id="btnCancel"
				v-on:click="dialog = false"
				outline
				color="p_text"
				class="title button">
				BACK
			</v-btn>
			<div
				class="offer-name pa-4 title p_input_text--text p_input">
				<span class="p_input_text--text pr-4">{{ user_object.name }}</span>
			</div>
			<input
				type="text"
				placeholder="Your offer"
				v-model="price"
				class="offer-price pa-4 p_input_text--text p_input title">
		</v-card>
	</v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
	data () {
		return {
			price: '',
			dialog: false,
			offerSubmitted: false
		}
	},
	computed: {
		...mapGetters(['user_object', 'user_id', 'route_config'])
	},
	methods: {
		submitOffer () {
			// Validate submission
			if (this.price === '') {
				alert('Please enter a value for your offer price')
			} else if (this.price.match(/[a-z]/i)) {
				alert('Please enter a number for your offer price')
			} else if (this.price <= 0) {
				alert('Please enter a positive non-zero value for your offer')
			} else {
				// Add the offer to the property after all checks
				var propertyId = this.$route.params.property_id
				const body = {
					property_id: propertyId,
					user_id: this.user_id,
					buyer_account_address: this.user_object.account_address,
					buyer_name: this.user_object.name,
					offer: this.price
				}

				console.log(this.user_object)

				axios.post('http://localhost:3000/api/properties/' + propertyId +
				'/add-offer', body, this.route_config).then(result => {
					console.log(result)
					this.dialog = false
					this.offerSubmitted = true
				})
					.catch(err => console.log(err))
			}
		}
	}
}
</script>

<style>

.v-dialog {
	width: 67%;
	height: 33%;
	border-radius: 25px;
}

.submit-offer-card {
	height: 100%;
	border-radius: 25px;
	display: grid;
	grid-gap: 1vmax;
	column-gap: 5vmax;
	grid-template-columns: repeat(3, 1fr);
	grid-template-rows: repeat(2, minmax(10vh, auto));
	align-items: center;
	justify-items: center;
}

.offer-price {
	grid-column: 2 / 4;
	grid-row: 2;
	padding: 1vmax;
	border-radius: 25px;
	width: 100%;
}

.offer-name {
	grid-column: 2 / 4;
	grid-row: 1;
	padding: 1vmax;
	border-radius: 25px;
	width: 100%;
}

</style>
