<template>

	<v-layout column class="main-ps-container">

		<h1
			class="display-3 p_text--text font-weight-bold">Search for properties</h1>

		<v-alert v-model="invalidForm" dismissible type="error">
			<span><b>Please correct the following error(s):- </b></span>
			<ul>
				<li v-for="(error, index) in errors" :key="index">
					{{ error }}
				</li>
			</ul>
		</v-alert>

		<div class="ps-card-container">

			<v-card class="primary p_text--text pa-4 ps-card display-1">

				<div class="search-criteria pa-4">

					<input
						v-model="search_criteria.location"
						type="text"
						placeholder="Enter a location, e.g. City, Town, Country or Post code"
						class="search-location pa-4 p_input_text--text p_input title">

					<input
						v-model="search_criteria.bed_count"
						type="text"
						placeholder="No. of Bedrooms"
						class="search-bed-count pa-4 p_input_text--text p_input title">

					<input
						v-model="search_criteria.bath_count"
						type="text"
						placeholder="No. of Bathrooms"
						class="search-bath-count pa-4 p_input_text--text p_input title">

					<select
						class="search-type pa-4 p_input_text--text p_input title"
						v-model="search_criteria.type">
						<option disabled value="">Select property type</option>
						<option v-for="(index,type) in types" v-bind:key="type">
						{{ types[type] }}</option>
					</select>

					<input
						v-model="search_criteria.min_price"
						type="text"
						placeholder="Min. Price"
						class="search-min-price pa-4 p_input_text--text p_input title">

					<input
						v-model="search_criteria.max_price"
						type="text"
						placeholder="Max. Price"
						class="search-max-price pa-4 p_input_text--text p_input title">

				</div>

				<div class="ps-button-container">
					<v-btn @click="submitSearch"
						color="p_blue"
						outline
						class="title btnSearch">
						SEARCH
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
			search_criteria: {
				location: '',
				bed_count: '',
				bath_count: '',
				type: '',
				min_price: '',
				max_price: ''
			},
			types: ['Apartment', 'Detached House', 'Attached House', 'Condominium', 'Townhouse'],
			invalidForm: false,
			errors: []
		}
	},
	methods: {

		submitSearch () {
			var form = this.search_criteria
			const validForm = this.validateFormFilled(form)
			if (validForm) {
				var minPrice = Number(form.min_price)
				var maxPrice = Number(form.max_price)
				var bedCount = Number(form.bed_count)
				var bathCount = Number(form.bath_count)

				const config = this.route_config
				config.params = {
					location: form.location,
					type: form.type,
					bedcount: bedCount,
					bathcount: bathCount,
					minprice: minPrice,
					maxprice: maxPrice
				}

				axios.get('http://localhost:3000/api/properties/search', config)
					.then((response) => {
						console.log(response.data.properties)
					})
					.catch((error) => console.log(error))
			}
		},

		validateFormFilled (form) {
			this.errors = []
			if (form.location === '') {
				this.errors.push('Please enter a location')
			} else if (form.bed_count === '' || form.bath_count === '') {
				this.errors.push('Please enter a bedroom count and bathroom count')
			} else if (form.type === '') {
				this.errors.push('Please select a property type')
			} else if (form.min_price === '' || form.max_price === '') {
				this.errors.push('Please enter a min price and max price')
			}

			if (this.errors.length > 0) {
				this.invalidForm = true
				return false
			} else {
				this.invalidForm = false
				return this.validateFormFields(form)
			}
		},

		validateFormFields (form) {
			this.errors = []
			if (form.bed_count.match(/[a-z]/i) || form.bath_count.match(/[a-z]/i)) {
				this.errors.push('Please enter a number for the bedroom and bathroom counts')
			} else if (form.min_price.match(/[a-z]/i)) {
				this.errors.push('Please enter a number for the min. price')
			} else if (form.max_price.match(/[a-z]/i)) {
				this.errors.push('Please enter a number for the max. price')
			}

			let minPrice = Number(form.min_price)
			let maxPrice = Number(form.max_price)

			if (maxPrice < minPrice) {
				this.errors.push('Please enter a higher max. price.')
			}

			if (this.errors.length > 0) {
				this.invalidForm = true
				return false
			} else {
				this.invalidForm = false
			}
			return true
		}
	},
	computed: {
		...mapGetters(['route_config'])
	}
}
</script>

<style>

.main-ps-container {
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

	.ps-card {
		border-radius: 25px;
		display: grid;
		grid-template-columns: repeat(1, 1fr);
		grid-template-rows: repeat(2, minmax(15vh, auto));
		align-items: center;
		justify-items: center;
	}

.search-criteria {
	display: grid;
	grid-template-columns: repeat(3, 25vw);
	grid-template-rows: repeat(3, 1fr);
	grid-gap: 25px;
	align-items: center;
	height: 100%;
}
	.search-location {
		grid-column: 1 / 4;
		grid-row: 1;
		padding: 10px;
		border-radius: 25px;
	}

	.search-bed-count {
		grid-column: 1 / 2;
		grid-row: 2;
		padding: 10px;
		border-radius: 25px;
	}

	.search-bath-count {
		grid-column: 2 / 3;
		grid-row: 2;
		padding: 10px;
		border-radius: 25px;
	}

	.search-type {
		grid-column: 1 / 3;
		grid-row: 3;
		padding: 10px;
		border-radius: 25px;
	}

	.search-min-price {
		grid-column: 3 / 4;
		grid-row: 2;
		padding: 10px;
		border-radius: 25px;
	}

	.search-max-price {
		grid-column: 3 / 4;
		grid-row: 3;
		padding: 10px;
		border-radius: 25px;
	}

.ps-button-container {
	width: 100%;
	border-radius: 20px;
	display: grid;
	align-items: center;
	justify-items: center;
}

.btnSearch {
	height: 10vh;
	width: 25vw;
	border-radius: 10px;
}

</style>
