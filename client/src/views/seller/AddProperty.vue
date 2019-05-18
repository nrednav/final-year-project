<template>
	<v-layout column>
		<v-alert v-model="formInvalid" dismissible type="error">
			<span><b>Please correct the following error(s):- </b></span>
			<ul>
				<li v-for="(error, index) in errors" :key="index">
					{{ error }}
				</li>
			</ul>
		</v-alert>

		<v-container class="ap-panel white--text">

			<v-card class="ap-property-details primary">

				<div class="ap-details">

					<input v-model="property.details.name" type="text" placeholder="Property Name" class="ap-property-name pa-4 p_input_text--text p_input title">

					<input v-model="property.details.address.street" type="text" placeholder="Street" class="ap-street pa-4 p_input_text--text p_input title">

					<select class="ap-country pa-4 p_input_text--text p_input title" v-model="property.details.address.country">
						<option disabled value="">Select a country</option>
						<option v-for="(index, country) in countries" :key="country">
						{{ countries[country] }}</option>
					</select>

					<select
						v-if="property.details.address.country !== ''"
						class="ap-city pa-4 p_input_text--text p_input title" v-model="property.details.address.city">
						<option disabled value="">Select a city</option>
						<option
							v-for="city in cities[property.details.address.country]" :key="city">
						{{ city }}</option>
					</select>

					<input v-model="property.details.address.post_code" type="text" placeholder="Post Code" class="ap-post-code pa-4 p_input_text--text p_input title">
					<input v-model="property.details.bedroom_count" type="text" placeholder="Bedroom Count" class="ap-bed-count pa-4 p_input_text--text p_input title">

					<input v-model="property.details.bathroom_count" type="text" placeholder="Bathroom Count" class="ap-bath-count pa-4 p_input_text--text p_input title">

					<select class="ap-property-type pa-4 p_input_text--text p_input title" v-model="property.details.type">
						<option disabled value="">Select property type</option>
						<option v-for="(index,type) in types" v-bind:key="type">{{ types[type] }}</option>
					</select>

					<input v-model="property.details.size" type="text" placeholder="Size" class="ap-p-size pa-4 p_input_text--text p_input title">

				</div>

			</v-card>

			<v-card class="ap-property-details-2 primary">
				<div class="ap-details-2">
					<input v-model="property.details.listing_price" type="text" placeholder="Listing Price" class="ap-p-price pa-4 p_input_text--text p_input title">
					<input v-model="property.details.deposit" type="text" placeholder="Deposit" class="ap-p-deposit pa-4 p_input_text--text p_input title">
					<label class="ap-p-date-label pa-4 p_input_text--text title text-xs-right">
						Available from:
					</label>
					<v-menu>
						<v-text-field background-color="p_input" class="ap-p-available-from" dark :value="available_from" slot="activator"></v-text-field>
						<v-date-picker class="ap-p-date-picker" color="p_text" v-model="property.details.available_from" type="month"></v-date-picker>
					</v-menu>
				</div>
			</v-card>

			<v-card class="image-upload-container primary">
				<div class="ap-upload-panel">
					<vue-upload-multiple-image
						@upload-success="imagesUploaded"
						@edit-image="imageEdited"
						@before-remove="beforeRemovingImage"
						@data-change="selectImages"
						dragText="Drag your images here or"
						browseText="Click here to browse"
						primaryText="Default"
						markIsPrimaryText="Set as default image"
						popupText="This image will be set as the default"
						dropText="Drag 'n' Drop"
						multiple>
					</vue-upload-multiple-image>
				</div>
			</v-card>

			<v-card class="ap-property-description primary">
				<textarea v-model="property.details.description" placeholder="Add a description" class="p-description pa-4 p_input_text--text p_input title">
				</textarea>
			</v-card>

			<div class="ap-button_container">
				<v-btn @click="cancel" outline color="p_red" class="title button">CANCEL</v-btn>
				<v-btn @click="saveForm" outline color="p_blue" class="title button">SAVE</v-btn>
			</div>

		</v-container>
	</v-layout>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import VueUploadMultipleImage from 'vue-upload-multiple-image'
import { mapGetters } from 'vuex'

import countryData from '@/assets/countries.json'

export default {
	components: {
		VueUploadMultipleImage
	},
	data () {
		return {
			menu: false,
			images: [],
			property: {
				details: {
					name: '',
					description: '',
					address: {
						street: '',
						city: 'default',
						country: '',
						post_code: ''
					},
					type: '',
					bedroom_count: null,
					bathroom_count: null,
					size: '',
					listing_price: null,
					deposit: null,
					available_from: new Date().toISOString().substr(0, 7)
				}
			},
			types: ['Apartment', 'Detached House', 'Attached House', 'Condominium', 'Townhouse'],
			countries: Object.keys(countryData),
			cities: countryData,
			errors: [],
			formInvalid: false
		}
	},
	methods: {
		selectImages (data) {
			console.log('data-changed', data)
		},
		imagesUploaded (formData, index, fileList, imageFiles) {
			this.images = imageFiles
			console.log(imageFiles)
		},
		imageEdited (formData, index, fileList, imageFiles) {
			this.images = imageFiles
		},
		beforeRemovingImage (index, done, fileList, imageFiles) {
			this.images = imageFiles
			var response = confirm('Are you sure you want to remove this image?')
			if (response) {
				done()
			}
		},
		validateFormNotEmpty () {
			let form = this.property.details
			for (var key in form) {
				if (form[key] === null || form[key] === '') {
					this.errors.push('One or more fields have been left empty in the form')
					return false
				}
			}
			return true
		},
		validateForm () {
			this.errors = []
			let details = this.property.details

			if (this.validateFormNotEmpty()) {
				if (isNaN(details.listing_price)) {
					this.errors.push('Please enter a number for the listing price.')
				} else if (isNaN(details.deposit)) {
					this.errors.push('Please enter a number for the deposit')
				} else if (isNaN(details.bedroom_count)) {
					this.errors.push('Please enter a number for the bedroom count')
				} else if (isNaN(details.bathroom_count)) {
					this.errors.push('Please enter a number for the bathroom count')
				} else if (details.address.country === '') {
					this.errors.push('Please select a country')
				} else if (details.address.city === 'default') {
					this.errors.push('Please select a city')
				}

				if (this.errors.length > 0) {
					this.formError()
					return false
				}
			} else {
				this.formError()
				return false
			}
			return true
		},
		async saveForm () {
			var validated = this.validateForm()

			if (validated) {
				const formData = new FormData()
				this.property.details.owner = this.user_id
				formData.append('property', JSON.stringify(this.property))
				for (var i in this.images) {
					formData.append('files', this.images[i])
				}
				try {
					let result = await axios.post('http://localhost:3000/api/properties/create', formData, this.route_config)
					if (result.status === 200) {
						this.$router.push('/seller/dashboard')
					}
				} catch (err) {
					throw err
				}
			}
		},
		cancel () {
			this.$router.push('/seller/dashboard')
		},
		formError () {
			this.formInvalid = true
			window.scrollTo(0, 0)
		}
	},
	computed: {
		available_from () {
			return this.property.details.available_from ? moment(this.property.details.available_from).format('MMMM YYYY') : ''
		},
		...mapGetters([
			'user_id',
			'route_config'
		])
	}
}
</script>

<style>

.ap-panel {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-template-rows: repeat(4, minmax(20vh, auto));
	grid-gap: 50px;
	max-width: 100vw;
}

.ap-property-details {
	grid-row: 1 / 3;
	grid-column: 1 / 2;
	border-radius: 20px;
	overflow-wrap: break-word;
	word-wrap: break-word;
	hyphens: auto;
}

	.ap-details {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-template-rows: repeat(5, minmax(10vh, auto));
		grid-gap: 20px;
		padding: 2vw;
		max-width: 100%;
	}

	.ap-property-name {
		grid-column: 1 / 3;
		grid-row: 1;
		padding: 10px;
		border-radius: 25px;
	}

	.ap-street {
		grid-column: 1 / 2;
		grid-row: 3;
		padding: 10px;
		border-radius: 25px;
	}

	.ap-city {
		grid-column: 2 / 3;
		grid-row: 2;
		padding: 10px;
		border-radius: 25px;
	}

	.ap-country {
		grid-column: 1 / 2;
		grid-row: 2;
		padding: 10px;
		border-radius: 25px;
	}

	.ap-post-code {
		grid-column: 2 / 3;
		grid-row: 3;
		padding: 10px;
		border-radius: 25px;
	}

	.ap-property-type {
		grid-column: 1 / 2;
		grid-row: 4;
		border-radius: 25px;
		padding: 10px;
	}

	.ap-property-type option {
		background-color: #1e232a;
	}

	.ap-p-size {
		grid-column: 2 / 3;
		grid-row: 4;
		border-radius: 25px;
		padding: 10px;
	}

	.ap-bed-count {
		grid-column: 1 / 2;
		grid-row: 5;
		border-radius: 25px;
		padding: 10px;
	}

	.ap-bath-count {
		grid-column: 2 / 3;
		grid-row: 5;
		border-radius: 25px;
		padding: 10px;
	}

.ap-property-details-2 {
	grid-row: 1;
	grid-column: 2;
	overflow-wrap: break-word;
	word-wrap: break-word;
	hyphens: auto;
	border-radius: 20px;
}

	.ap-details-2 {
		grid-column: 1;
		grid-row: 1;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-template-rows: repeat(2, minmax(10vh, auto));
		grid-gap: 20px;
		padding: 2vw;
		max-width: 100%;
	}

	.ap-p-price {
		grid-column: 1 / 2;
		grid-row: 1;
		border-radius: 25px;
		padding: 10px;
	}

	.ap-p-deposit {
		grid-column: 2 / 3;
		grid-row: 1;
		border-radius: 25px;
		padding: 10px;
	}

	.ap-p-available-from.v-input .v-input__slot {
		grid-column: 1 / 3;
		grid-row: 2;
		border-radius: 15px;
		padding: 10px;
	}

		.ap-p-available-from input {
			text-align: center;
		}

	.ap-p-date-picker {
		border-radius: 25px;
	}

.ap-property-description {
	display: grid;
	grid-template-columns: repeat(1, 1fr);
	grid-row: 3 / 5;
	padding: 20px;
	border-radius: 20px;
}

	.ap-property-description p-description {
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

.ap-upload-panel {
	grid-row: 1;
	grid-column: 1;
	display: grid;
	grid-template-columns: repeat(1, 1fr);
	grid-template-rows: repeat(1, auto);
	width: 100%;
	height: 100%;
}

.image-center {
	background: #2a313b;
	border-radius: 20px;
}

.image-container[data-v-10e59822] {
	width: 100%;
	height: 50vh;
	border: 1px solid #707070;
	border-radius: 20px;
	background-color: #2a313b;
}

	.browse-text[data-v-10e59822] {
		color: white;
	}

	.preview-image[data-v-10e59822] {
		height: 90%;
	}

	.image-icon-delete[data-v-10e59822] {
		height: 20px;
		width: 20px;
		fill: white;
	}

	.image-icon-edit[data-v-10e59822] {
		height: 20px;
		width: 20px;
		fill: white;
	}

	.add-image-svg[data-v-10e59822] {
		height: 20px;
		width: 20px;
		fill: white;
	}

	.image-icon-info[data-v-10e59822] {
		height: 20px;
		width: 20px;
		fill: white;
	}

	.mark-text-primary[data-v-10e59822] {
		color: white;
	}

	.image-overlay[data-v-10e59822] {
		background: rgba(30,35,42,.7);
	}

	.show-img[data-v-10e59822] {
		max-height: 250px;
		height: 250px;
		max-width: 250px;
		width: 250px;
		border-radius: 20px;
	}

	.image-list-container[data-v-10e59822] {
		padding-top: 20px;
	}

	.image-list-item[data-v-10e59822] {
		width: 50px;
		height: 50px;
	}

.ap-button_container {
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 20px;
}

.button {
	border-radius: 10px;
	width: 20vw;
	height: 10vh;
}

</style>
