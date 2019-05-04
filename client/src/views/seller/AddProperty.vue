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

			<v-card class="image-upload-panel primary">
				<v-container class="dropbox text-xs-center p_input_text--text">
					<p class="display-1">
						Drag images of your property here <br>
						or click below to browse.
					</p>
					<input type="file" multiple ref="images" @change="selectImages" class="file-input" placeholder="Drag images of your property here <br> or click here to browse.">
					<div class="selected-images headline">
						You added the following files:-<br>
						<ul>
							<li v-for="(image, index) in property.details.images" :key="index">
								{{ image.name }}
							</li>
						</ul>
					</div>
				</v-container>
			</v-card>

			<v-card class="property-description primary">
				<textarea v-model="property.details.description" placeholder="Add a description" class="p-description pa-4 p_input_text--text p_input title">
				</textarea>
			</v-card>

			<div class="buttons primary">
			</div>

		</v-container>
	</v-layout>
</template>

<script>
import moment from 'moment'

export default {
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
		selectImages () {
			const images = this.$refs.images.files
			this.property.details.images = [ ...this.property.details.images, ...images ]
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

	.p-available-from {
		grid-column: 1 / 3;
		grid-row: 2;
		border-radius: 25px;
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

.image-upload-panel {
	display: grid;
	grid-template-columns: repeat(1, 1fr);
	grid-template-rows: repeat(2, auto);
	grid-row: 2 / 4;
	padding: 20px;
	border-radius: 20px;
}

	.dropbox {
		grid-column: 1;
		grid-row: 1;
		border-radius: 25px;
		width: 100%;
		height: 100%;
		cursor: pointer;
	}

	.file-input {
		opacity: 0;
		height: 100%;
		width: 100%;
		cursor: pointer;
	}

	.selected-images {
		grid-column: 1;
		grid-row: 2;
	}

.buttons {
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 20px;
}

</style>
