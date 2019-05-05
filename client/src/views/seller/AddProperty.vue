<template>
	<v-layout column>
		<v-container class="panel white--text">

			<v-card class="property-details primary">
				<div class="details">
					<input v-model="property.details.name" type="text" placeholder="Property Name" class="property-name pa-4 p_input_text--text p_input title">
					<input v-model="property.details.street" type="text" placeholder="Street" class="street pa-4 p_input_text--text p_input title">
					<input v-model="property.details.city" type="text" placeholder="City" class="city pa-4 p_input_text--text p_input title">
					<input v-model="property.details.country" type="text" placeholder="Country" class="country pa-4 p_input_text--text p_input title">
					<input v-model="property.details.post_code" type="text" placeholder="Post Code" class="post-code pa-4 p_input_text--text p_input title">
					<input v-model="property.details.bed_count" type="text" placeholder="Bedroom Count" class="bed-count pa-4 p_input_text--text p_input title">
					<input v-model="property.details.bath_count" type="text" placeholder="Bathroom Count" class="bath-count pa-4 p_input_text--text p_input title">
					<select class="property-type pa-4 p_input_text--text p_input title" v-model="property.details.type">
						<option disabled value="">Select property type</option>
						<option v-for="(index,type) in types" v-bind:key="type">{{ types[type] }}</option>
					</select>
					<input v-model="property.details.size" type="text" placeholder="Size" class="p-size pa-4 p_input_text--text p_input title">
				</div>
			</v-card>

			<v-card class="property-details-2 primary">
				<div class="details-2">
					<input v-model="property.details.price" type="text" placeholder="Listing Price" class="p-price pa-4 p_input_text--text p_input title">
					<input v-model="property.details.deposit" type="text" placeholder="Deposit" class="p-deposit pa-4 p_input_text--text p_input title">
					<label class="p-date-label pa-4 p_input_text--text title text-xs-right">
						Available from:
					</label>
					<v-menu>
						<v-text-field background-color="p_input" class="p-available-from" dark :value="available_from" slot="activator"></v-text-field>
						<v-date-picker class="p-date-picker" color="p_text" v-model="property.details.available_from" type="month"></v-date-picker>
					</v-menu>
				</div>
			</v-card>

			<v-card class="image-upload-container primary">
				<div class="upload-panel">
					<vue-upload-multiple-image
						@upload-success="imagesUploaded"
						@edit-image="imageEdited"
						@before-remove="removeImage"
						@data-change="selectImages"
						:data-images="property.details.images"
						dragText="Drag your images here or"
						browseText="Click here to browse"
						primaryText="Default"
						markIsPrimaryText="Set as default image"
						popupText="This image will be set as the default"
						dropText="Drag 'n' Drop"
						maxImage=5
						multiple>
					</vue-upload-multiple-image>
				</div>
			</v-card>

			<v-card class="property-description primary">
				<textarea v-model="property.details.description" placeholder="Add a description" class="p-description pa-4 p_input_text--text p_input title">
				</textarea>
			</v-card>

			<div class="button_container">
				<v-btn outline color="p_red" class="title button">CANCEL</v-btn>
				<v-btn outline color="p_blue" class="title button">SAVE</v-btn>
			</div>

		</v-container>
	</v-layout>
</template>

<script>
import moment from 'moment'
import VueUploadMultipleImage from 'vue-upload-multiple-image'

export default {
	components: {
		VueUploadMultipleImage
	},
	data () {
		return {
			menu: false,
			property: {
				details: {
					name: '',
					description: '',
					street: '',
					city: '',
					country: '',
					post_code: '',
					type: '',
					bed_count: null,
					bath_count: null,
					size: '',
					price: null,
					deposit: null,
					available_from: new Date().toISOString().substr(0, 7),
					images: []
				}
			},
			types: ['Apartment', 'Detached House', 'Attached House', 'Condominium', 'Townhouse']
		}
	},
	methods: {
		selectImages (data) {
			console.log(data)
			// const images = this.$refs.images.files
			// this.property.details.images = [ ...this.property.details.images, ...images ]
		},
		imagesUploaded (formData, index, fileList) {
			console.log('data', formData, index, fileList)
		},
		imageEdited (formData, index, fileList) {
			console.log('edited data', formData, index, fileList)
		},
		removeImage (index, done, fileList) {
			console.log('index', index, fileList)
			var response = confirm('Are you sure you want to remove this image?')
			if (response) {
				done()
			}
		}
	},
	computed: {
		available_from () {
			return this.property.details.available_from ? moment(this.property.details.available_from).format('MMMM YYYY') : ''
		}
	}
}
</script>

<style>

.panel {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-template-rows: repeat(4, minmax(20vh, auto));
	grid-gap: 50px;
	max-width: 100vw;
}

.property-details {
	grid-row: 1 / 3;
	border-radius: 20px;
}

	.details {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-template-rows: repeat(5, minmax(10vh, auto));
		grid-gap: 20px;
		padding: 2vw;
		max-width: 100%;
	}

	.property-name {
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

.property-details-2 {
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 20px;
}

	.details-2 {
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

	.p-available-from.v-input .v-input__slot {
		grid-column: 1 / 3;
		grid-row: 2;
		border-radius: 15px;
		padding: 10px;
	}

		.p-available-from input {
			text-align: center;
		}

	.p-date-picker {
		border-radius: 25px;
	}

.property-description {
	display: grid;
	grid-template-columns: repeat(1, 1fr);
	grid-row: 3 / 5;
	padding: 20px;
	border-radius: 20px;
}

	.property-description p-description {
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

.upload-panel {
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

.button_container {
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
